#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '../../logs');

async function captureConsoleNetwork(url, durationSeconds = 10) {
  await mkdir(logsDir, { recursive: true });

  let launch;
  try {
    launch = (await import('chrome-launcher')).launch;
  } catch {
    console.error('Install: npm install -D chrome-launcher chrome-remote-interface');
    process.exit(1);
  }

  const chrome = await launch({
    chromeFlags: ['--headless', '--disable-gpu', '--window-size=1920,1080']
  });

  const logs = { console: [], network: [], errors: [], url, capturedAt: new Date().toISOString() };

  try {
    let CDP;
    try {
      CDP = (await import('chrome-remote-interface')).default;
    } catch {
      console.error('Install: npm install -D chrome-remote-interface');
      await chrome.kill();
      process.exit(1);
    }
    const client = await CDP({ port: chrome.port });
    const { Page, Runtime, Network, Log } = client;

    // Enable domains
    await Promise.all([Page.enable(), Runtime.enable(), Network.enable(), Log.enable()]);

    // Capture console messages
    Runtime.consoleAPICalled(({ type, args }) => {
      logs.console.push({
        type,
        message: args.map(a => a.value || a.description || '').join(' '),
        timestamp: new Date().toISOString()
      });
    });

    // Capture exceptions
    Runtime.exceptionThrown(({ exceptionDetails }) => {
      logs.errors.push({
        type: 'exception',
        message: exceptionDetails.text || exceptionDetails.exception?.description,
        timestamp: new Date().toISOString()
      });
    });

    // Capture network requests
    const requests = new Map();

    Network.requestWillBeSent(({ requestId, request, timestamp }) => {
      requests.set(requestId, {
        url: request.url,
        method: request.method,
        startTime: timestamp
      });
    });

    Network.responseReceived(({ requestId, response, timestamp }) => {
      const req = requests.get(requestId);
      if (req) {
        logs.network.push({
          url: req.url,
          method: req.method,
          status: response.status,
          statusText: response.statusText,
          mimeType: response.mimeType,
          timing: timestamp - req.startTime
        });
      }
    });

    Network.loadingFailed(({ requestId, errorText }) => {
      const req = requests.get(requestId);
      logs.errors.push({
        type: 'network',
        url: req?.url,
        error: errorText,
        timestamp: new Date().toISOString()
      });
    });

    // Navigate and wait
    await Page.navigate({ url });
    await Page.loadEventFired();

    console.log(`Capturing for ${durationSeconds} seconds...`);
    await new Promise(r => setTimeout(r, durationSeconds * 1000));

    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `capture-${timestamp}.json`;
    const filepath = join(logsDir, filename);

    await writeFile(filepath, JSON.stringify(logs, null, 2));
    console.log(`\nCapture saved: ${filepath}`);
    console.log(`Console messages: ${logs.console.length}`);
    console.log(`Network requests: ${logs.network.length}`);
    console.log(`Errors: ${logs.errors.length}`);

    if (logs.errors.length > 0) {
      console.log('\nErrors found:');
      logs.errors.forEach(e => console.log(`  - ${e.type}: ${e.message || e.error}`));
    }

    await client.close();
  } finally {
    await chrome.kill();
  }
}

const [,, url, duration] = process.argv;

if (!url) {
  console.log('Usage: node capture.mjs <url> [duration-seconds]');
  console.log('Example: node capture.mjs http://localhost:3000 15');
  process.exit(1);
}

captureConsoleNetwork(url, parseInt(duration) || 10).catch(console.error);
