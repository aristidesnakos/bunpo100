#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '../../screenshots');

async function captureScreenshot(url, name = 'screenshot') {
  await mkdir(screenshotsDir, { recursive: true });

  let launch;
  try {
    launch = (await import('chrome-launcher')).launch;
  } catch {
    console.error('Install dependency: npm install -D chrome-launcher chrome-remote-interface');
    process.exit(1);
  }

  const chrome = await launch({
    chromeFlags: ['--headless', '--disable-gpu', '--window-size=1920,1080']
  });

  try {
    let CDP;
    try {
      CDP = (await import('chrome-remote-interface')).default;
    } catch {
      console.error('Install dependency: npm install -D chrome-remote-interface');
      await chrome.kill();
      process.exit(1);
    }
    const client = await CDP({ port: chrome.port });
    const { Page } = client;

    await Page.enable();
    await Page.navigate({ url });
    await Page.loadEventFired();

    // Wait for content to render
    await new Promise(r => setTimeout(r, 2000));

    const { data } = await Page.captureScreenshot({ format: 'png', captureBeyondViewport: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const filepath = join(screenshotsDir, filename);

    await writeFile(filepath, Buffer.from(data, 'base64'));
    console.log(`Screenshot saved: ${filepath}`);

    await client.close();
  } finally {
    await chrome.kill();
  }
}

const [,, url, name] = process.argv;

if (!url) {
  console.log('Usage: node capture.mjs <url> [name]');
  console.log('Example: node capture.mjs http://localhost:3000 homepage');
  process.exit(1);
}

captureScreenshot(url, name).catch(console.error);
