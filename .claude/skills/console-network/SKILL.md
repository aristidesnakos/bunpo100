---
name: console-network
description: Capture browser console logs and network requests for debugging
triggers:
  - console log
  - network request
  - debug browser
  - inspect page
  - check errors
---

# Console & Network Capture Skill

Captures browser console output and network requests from a running page.

## Usage

```bash
node .claude/skills/console-network/capture.mjs <url> [duration-seconds]
```

## Examples

```bash
# Capture for 10 seconds (default)
node .claude/skills/console-network/capture.mjs http://localhost:3000

# Capture for 30 seconds
node .claude/skills/console-network/capture.mjs http://localhost:3000/dashboard 30

# Debug API calls
node .claude/skills/console-network/capture.mjs http://localhost:3000/swms 20
```

## Output

Saves JSON report to `.claude/logs/` with:
- Console messages (log, warn, error, info)
- Network requests (URL, method, status, timing)
- Page errors and exceptions

## Workflow

1. Start dev server: `pnpm dev`
2. Run capture on target page
3. Review JSON output for errors/issues
4. Fix identified problems
