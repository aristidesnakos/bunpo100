---
name: screenshot-test
description: Capture and compare screenshots for visual regression testing
triggers:
  - screenshot
  - visual test
  - compare UI
  - check rendering
---

# Screenshot Testing Skill

Captures screenshots of pages/components for visual verification.

## Usage

1. Start dev server: `pnpm dev`
2. Run screenshot capture:
   ```bash
   node .claude/skills/screenshot-test/capture.mjs <url> [output-name]
   ```

## Examples

```bash
# Capture homepage
node .claude/skills/screenshot-test/capture.mjs http://localhost:3000 homepage

# Capture dashboard
node .claude/skills/screenshot-test/capture.mjs http://localhost:3000/dashboard dashboard

# Capture SWMS page
node .claude/skills/screenshot-test/capture.mjs http://localhost:3000/swms swms-form
```

## Output

Screenshots saved to `.claude/screenshots/` with timestamp.
Format: `{name}-{timestamp}.png`

## Workflow

1. Capture baseline before changes
2. Make code changes
3. Capture new screenshot
4. Compare visually or use diff tool
