# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bunpo100 is a Japanese grammar learning app built with Next.js 15 (App Router) and shadcn/ui. Users learn the 100 most common Japanese grammar structures with client-side progress tracking (localStorage). No backend services required — the app is fully static/client-side.

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (next/core-web-vitals)
```

No test framework is configured.

## Architecture

**Stack:** Next.js 15 + TypeScript, shadcn/ui + Tailwind CSS, Framer Motion

**Data flow:**
- Grammar progress tracked client-side in localStorage via `hooks/useGrammarProgress.ts`
- No auth, no database, no API routes

**Server vs Client components:**
- Server components handle metadata and static rendering
- Client components (marked `'use client'`) handle interactivity, hooks, and state
- Common pattern: server page.tsx wraps a client `*Client.tsx` component (e.g., `app/grammar/page.tsx` → `GrammarClient.tsx`)

**Key directories:**
- `components/sections/` — Landing page sections (Header, Hero, Problem, Experience, FAQ, Footer)
- `components/ui/` — shadcn/ui primitives
- `lib/constants/grammar-structures.ts` — All 100 grammar items (~22KB)
- `lib/utils.ts` — `cn()` utility for Tailwind class merging
- `lib/seo.tsx` — SEO metadata helper

## Path Aliases

`@/*` maps to the project root (`./`). Use `@/components`, `@/lib`, `@/hooks`, etc.

## Styling

Tailwind CSS with a warm color palette (off-white `#fefcf7`, sepia accent `#d4a574`, charcoal text `#2c2c2c`). Georgia serif for headings, system-ui for body. Components use the `cn()` utility from `lib/utils.ts` for conditional class merging.
