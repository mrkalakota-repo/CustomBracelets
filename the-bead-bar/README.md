# Chic Charm Co. — Website (`the-bead-bar/`)

Next.js 16 + React 19 storefront and PWA. See the [root README](../README.md) for full project context, all third-party integrations, and Web vs. App differences.

## Commands

```bash
npm run dev              # dev server at localhost:3000
npm run build            # production build
npm run lint             # ESLint
npm test                 # Jest (unit + component)
npm run test:watch
npm run test:coverage
npm run test:e2e         # Playwright E2E (auto-starts dev server)
npx jest __tests__/lib/builder/pricing.test.ts   # single test file
npx playwright test e2e/builder-flow.spec.ts      # single E2E spec
```

## Environment Variables

Create `.env.local` in this directory:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
KLAVIYO_API_KEY=pk_...
KLAVIYO_DROP_LIST_ID=...
KLAVIYO_WAITLIST_LIST_ID=...
KLAVIYO_MARKETING_LIST_ID=...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

Cloudflare always-pass test keys: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

## Architecture Notes

See `CLAUDE.md` in this directory for full architecture details including routing, component structure, API security patterns, and compliance requirements.
