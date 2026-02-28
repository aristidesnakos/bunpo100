# Next.js SaaS Starter Template

A production-ready Next.js starter template with authentication, payments, blog, and more.

## Features

### Core Features
- **Authentication**: Supabase Auth with magic links and OAuth (Google)
- **Payments**: Stripe integration with subscription management
- **Blog**: MDX-based blog system with categories and authors
- **User Management**: Profile system, settings, and onboarding flow
- **Analytics**: PostHog integration for product analytics
- **Email**: Resend integration for transactional emails
- **Security**: Rate limiting, CAPTCHA, and security checks
- **SEO**: Built-in SEO utilities and structured data (JSON-LD)
- **UI Components**: Shadcn/ui component library
- **TypeScript**: Full TypeScript support
- **Styling**: Tailwind CSS with custom design system

### Pages Included
- **Landing Page** with structured sections:
  - Header with navigation
  - Hero section (value proposition)
  - Problem section (pain points)
  - Features/Experience section
  - Pricing tables
  - FAQ section
  - Footer
- **Authentication** (sign in/sign up)
- **User onboarding** flow
- **Settings** (account, billing, appearance)
- **Blog** with categories and author pages
- **Legal Pages** (Terms of Service & Privacy Policy)
- **Dashboard** (customize as needed)

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Stripe account
- Resend account (for emails)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/nextjs-starter.git
cd nextjs-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Set up Supabase project and add credentials
   - Add Stripe API keys
   - Add Resend API key
   - (Optional) Add PostHog and OpenAI keys

5. Set up Supabase:
   - Create a new Supabase project
   - Run the database migrations (see `supabase/migrations`)
   - Enable Google OAuth if needed

6. Configure Stripe:
   - Create products and prices in Stripe Dashboard
   - Update pricing plans in `lib/pricing/constants.ts`
   - Set up webhook endpoint for `/api/webhook/stripe`

7. Update configuration:
   - Edit `config.ts` with your app details
   - Update legal pages with your company information
   - Customize the landing page content

8. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
nextjs-starter/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── stripe/      # Payment endpoints
│   │   └── webhook/     # Webhook handlers
│   ├── blog/            # Blog pages
│   ├── settings/        # User settings
│   ├── signin/          # Authentication
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── sections/       # Page sections
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── Experience.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   └── buttons/        # Button components
├── lib/                # Utilities and helpers
│   ├── supabase/       # Supabase clients
│   ├── emails/         # Email templates
│   ├── stripe.ts       # Stripe configuration
│   ├── seo.tsx         # SEO utilities
│   └── jsonld.tsx      # Structured data
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── types/              # TypeScript types
└── config.ts           # App configuration
```

## Customization Guide

### Adding New Pages
1. Create a new folder in `app/`
2. Add `page.tsx` for the route
3. Use existing components and layouts

### Modifying the Theme
- Edit `app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Modify component styles in `components/ui/`

### Adding API Routes
1. Create route handlers in `app/api/`
2. Use middleware for authentication checks
3. Implement rate limiting where needed

### Database Schema
- Supabase tables are defined via migrations
- Key tables: profiles, subscriptions, blog_posts
- Extend schema as needed for your use case

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Supports deployment on Netlify, Railway, etc.
- Ensure Node.js 18+ runtime
- Set environment variables

## Environment Variables

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `RESEND_API_KEY`: Resend API key for emails

Optional:
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key
- `OPENAI_API_KEY`: For AI features
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile for CAPTCHA

## License

MIT License - feel free to use this template for your projects.

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Stripe.