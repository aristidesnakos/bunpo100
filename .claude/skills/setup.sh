#!/bin/bash
# Install dependencies for Claude Code skills
npm install -D chrome-launcher chrome-remote-interface 2>/dev/null || \
pnpm add -D chrome-launcher chrome-remote-interface 2>/dev/null || \
yarn add -D chrome-launcher chrome-remote-interface

echo "Skills dependencies installed"
