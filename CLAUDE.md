# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bunpo100 is a Japanese grammar learning SaaS built with Next.js 15 (App Router), Supabase (auth + PostgreSQL), Stripe (payments), and shadcn/ui. Users learn the 100 most common Japanese grammar structures with progress tracking.

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (next/core-web-vitals)
```

No test framework is configured.

## Architecture

**Stack:** Next.js 15 + TypeScript, Supabase (auth/db), Stripe (payments), Resend (email), shadcn/ui + Tailwind CSS

**Data flow:**
- Auth via Supabase (magic links + Google OAuth), session managed with cookies (`@supabase/ssr`)
- User state provided globally via `context/user.tsx` (UserContext/useUser hook)
- Grammar progress tracked client-side in localStorage via `hooks/useGrammarProgress.ts`
- Payments flow through API routes → Stripe → webhook updates `profiles.has_access` in Supabase

**Server vs Client components:**
- Server components handle metadata, auth checks, and data fetching
- Client components (marked `'use client'`) handle interactivity, hooks, and state
- Common pattern: server page.tsx wraps a client `*Client.tsx` component (e.g., `app/grammar/page.tsx` → `GrammarClient.tsx`)

**Key directories:**
- `app/api/` — Route handlers (Stripe checkout/portal, webhooks, OAuth callback)
- `components/sections/` — Landing page sections (Header, Hero, Pricing, FAQ, etc.)
- `components/ui/` — shadcn/ui primitives
- `lib/supabase/` — Three client variants: `client.ts` (browser), `server.ts` (server components/routes), `middleware.ts`
- `lib/constants/grammar-structures.ts` — All 100 grammar items (~22KB)
- `lib/pricing/` — Stripe plan definitions and types
- `types/` — Shared TypeScript types; `profiles.ts` uses Zod for runtime validation

**Supabase tables:** `profiles` (id, email, name, customer_id, price_id, has_access, updated_at)

## Path Aliases

`@/*` maps to the project root (`./`). Use `@/components`, `@/lib`, `@/hooks`, `@/context`, etc.

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`. See `.env.example` for the full list.

## Styling

Tailwind CSS with a warm color palette (off-white `#fefcf7`, sepia accent `#d4a574`, charcoal text `#2c2c2c`). Georgia serif for headings, system-ui for body. Dark mode class support is configured but not actively used. Components use the `cn()` utility from `lib/utils.ts` for conditional class merging.

## Stripe Integration

Two plans: Amateur ($10/mo) and Writer ($99/yr). Checkout sessions created via `POST /api/stripe/create-checkout`. Webhook at `POST /api/webhook/stripe` handles subscription lifecycle events and updates user profiles. Price IDs are defined in `lib/pricing/constants.ts`.
