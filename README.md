# Chic Charm Co.

D2C custom bracelet business targeting teen girls (13–17). Customers build bracelets via a 5-step wizard, browse curated drops, and check out with Stripe. Ships from home at launch (~10 orders/week).

**Brand:** Cream `#F5F0E8` · Sage Green `#8FAF8A` · Soft Gold `#C9A96E`  
**Price range:** $10–25

---

## Repository Structure

This is a monorepo — one git repo, three deployable units.

| Directory | What it is | Stack |
|---|---|---|
| `the-bead-bar/` | Website + PWA (primary storefront) | Next.js 16, React 19, TypeScript, Tailwind, Stripe, Supabase |
| `app/` | iOS + Android native app | Expo SDK 54, Expo Router 6, React Native, NativeWind, Zustand |
| `supabase/functions/` | Serverless backend shared by both | Deno, deployed to Supabase Edge Functions |

---

## Quick Start

### Website

```bash
cd the-bead-bar
npm install
npm run dev          # localhost:3000
```

### App

```bash
cd app
npm install
npx expo run:ios     # first build — installs native deps, ~5 min
npx expo start --ios --clear   # subsequent starts
```

**Never use `npx expo start` without `--ios` or `--android`** — web bundler fails.  
**Never use Expo Go** — requires a native dev build (expo-router 6).

### Supabase Edge Functions

```bash
supabase link --project-ref <project-ref>
supabase functions deploy checkout
supabase functions serve checkout    # local dev
supabase db push                     # apply migrations
```

---

## Third-Party Integrations

### Stripe — Payments

| Key | Where set | Used by |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Website `.env.local` | Website frontend (loads Stripe.js) |
| `STRIPE_SECRET_KEY` | Website `.env.local` + Supabase secret | Website API route + Edge Function |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | App `.env.local` | App `StripeProvider` in `_layout.tsx` |

- Website checkout: `POST /api/checkout` (Next.js route handler) → Stripe PaymentIntent
- App checkout: `POST supabase.co/functions/v1/checkout` → Stripe PaymentIntent (does NOT call the website)
- `stripe-webhook` Edge Function handles `payment_intent.succeeded` (creates orders, decrements inventory) and `charge.refunded` (restores inventory, marks order refunded)
- **Item prices are always recalculated server-side** — client-supplied prices are ignored

Test keys: use `pk_test_...` / `sk_test_...` from the Stripe dashboard. The publishable key is safe to expose; the secret key must never be in client code.

---

### Supabase — Database + Auth + Edge Functions

| Key | Where set | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Website `.env.local` | Website browser client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Website `.env.local` | Website browser client |
| `EXPO_PUBLIC_SUPABASE_URL` | App `.env.local` | App Supabase client |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | App `.env.local` | App Supabase client |
| `EXPO_PUBLIC_API_BASE_URL` | App `.env.local` | App checkout + Klaviyo calls (`https://<project>.supabase.co/functions/v1`) |

**Anon key format**: Edge Functions require the legacy JWT format (`eyJ...`). The newer `sb_publishable_...` format is for the JS client library only — using it in raw `fetch` headers returns 401.

Auth: Phone + 6-digit PIN via Supabase Auth (no email/password).  
Session storage: `SecureStore` on app, browser `localStorage` on website.

---

### Klaviyo — Email Marketing

| Key | Where set | Used by |
|---|---|---|
| `KLAVIYO_API_KEY` | Website `.env.local` + Supabase secret | Website API route + Edge Function |
| `KLAVIYO_DROP_LIST_ID` | Website `.env.local` + Supabase secret | Drop notify-me subscriptions |
| `KLAVIYO_WAITLIST_LIST_ID` | Website `.env.local` + Supabase secret | Sold-out waitlist subscriptions |
| `KLAVIYO_MARKETING_LIST_ID` | Website `.env.local` | General marketing |

API revision: `2023-12-15`. The `profile-subscription-bulk-create-jobs` endpoint only accepts `email` inside `profile.attributes` — do not include `source`, `first_name`, or any other field (returns HTTP 400).

---

### Cloudflare Turnstile — Bot Protection

| Key | Where set | Used by |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Website `.env.local` | `TurnstileWidget` component (baked in at build) |
| `TURNSTILE_SECRET_KEY` | Website `.env.local` | `/api/klaviyo/subscribe` server-side verification |

Applied to drop notify-me and waitlist forms. Gracefully degrades: widget renders nothing if site key is absent; server skips verification if secret key is absent (dev-safe).

Cloudflare always-pass test keys (staging only):
- Site key: `1x00000000000000000000AA`
- Secret: `1x0000000000000000000000000000000AA`

---

### PostHog — Product Analytics

| Key | Where set | Used by |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | Website `.env.local` | Website event tracking |
| `NEXT_PUBLIC_POSTHOG_HOST` | Website `.env.local` | PostHog ingest endpoint |
| *(no key needed)* | App `package.json` | `posthog-react-native` configured in app code |

---

### Sentry — Error Monitoring

| Key | Where set | Used by |
|---|---|---|
| `SENTRY_DSN` (website) | Website `.env.local` / `sentry.client.config.ts` | `@sentry/nextjs` |
| `SENTRY_DSN` (app) | App `.env.local` | `@sentry/react-native` |

---

### Upstash Redis — Distributed Rate Limiting

| Key | Where set | Used by |
|---|---|---|
| `UPSTASH_REDIS_URL` | Supabase secret | `checkout` Edge Function |
| `UPSTASH_REDIS_TOKEN` | Supabase secret | `checkout` Edge Function |

Used in the Edge Function for distributed rate limiting across isolate restarts. If unset, the function logs a warning and allows the request (graceful degradation).

---

## Web vs. React Native — Key Differences

### Payment Flow

| | Website | App |
|---|---|---|
| Checkout endpoint | `POST /api/checkout` (Next.js route) | `POST /functions/v1/checkout` (Supabase Edge Function) |
| Stripe client | `@stripe/react-stripe-js` + `@stripe/stripe-js` | `@stripe/stripe-react-native` |
| Stripe provider | `<Elements>` wrapper from `react-stripe-js` | `<StripeProvider>` in `app/_layout.tsx` |
| Payment UI | `<PaymentElement>` + `<ExpressCheckoutElement>` | Native `stripe-react-native` sheet |

The app **never** calls the website's API routes — it calls Supabase directly.

### Auth

| | Website | App |
|---|---|---|
| Session storage | Browser `localStorage` (Supabase default) | `expo-secure-store` |
| Nav after OTP | `router.replace('/profile')` | `router.dismissAll()` then `router.replace('/(tabs)/profile')` |
| Auth screens | Full-page routes (`/sign-in`, `/verify-phone`) | Modal screens (dismissed with `router.dismissAll()`) |

### Routing

| | Website | App |
|---|---|---|
| Router | Next.js App Router (file-based, `src/app/`) | Expo Router 6 (file-based, `app/app/`) |
| Tab navigation | N/A | Must use full paths: `/(tabs)/shop`, `/(tabs)/drops` |
| Dynamic routes | `params` is a Promise in server components — always `await` it | Standard RN navigation |

### Styling

| | Website | App |
|---|---|---|
| Framework | Tailwind CSS (standard) | NativeWind v4 (Tailwind classes on RN components) |
| CSS-in-JS | `globals.css` with CSS custom properties | `src/styles/global.css` imported only in `_layout.tsx` |
| No-go | — | No HTML entities in JSX (`&apos;` renders literally). Use `\u2019` or `{'\''}`; no smart quotes in string literals (Metro bundler error) |

### State Management

| | Website | App |
|---|---|---|
| Cart | React Context + `useReducer` | Zustand store persisted to AsyncStorage |
| Builder | Local component state in `BuilderFlow.tsx` | Zustand store (`src/store/builder.ts`) |
| Cart storage key | `localStorage` key `chic-charm-cart` | AsyncStorage key `chic-charm-cart` |

### Bot Protection

Turnstile is **website-only** — the app does not use Turnstile (native apps don't have the same bot risk surface).

### Images

| | Website | App |
|---|---|---|
| Component | `next/image` with `fill` + sized container | `expo-image` or `<Image>` from React Native |
| Format | SVG in `public/images/` | Bare key string (images not yet wired up) |

---

## Shared Business Logic

Pricing and catalog logic exists in **three places** — always update all three together:

| Logic | Website | App | Edge Function |
|---|---|---|---|
| Builder pricing | `the-bead-bar/src/lib/builder/pricing.ts` | `app/src/lib/builder/pricing.ts` | `supabase/functions/checkout/index.ts` (inlined) |
| Builder compatibility | `the-bead-bar/src/lib/builder/compatibility.ts` | `app/src/lib/builder/compatibility.ts` | — |
| Product catalog | `the-bead-bar/src/lib/products/catalog.ts` | `app/src/lib/products/catalog.ts` | — |

`BaseStyle` = `'beaded' | 'string' | 'chain' | 'stackable'`. Charm is an **add-on** (`addOns.charm`), not a base style.

---

## Builder Flow (5 Steps)

1. **Base Style** — beaded / string / chain / stackable
2. **Primary Color** — curated palette per season
3. **Accent/Pattern** — 3–5 combos per base (driven by `getCompatiblePatterns()`)
4. **Add-ons** — charm (+$3), text engraving, BFF duo mode (price × 2 − $2)
5. **Preview + Share** — shareable image

Selecting a new base style resets all downstream steps (enforced in both website `BuilderFlow.tsx` and app `builder.ts` store).

---

## Compliance

- **COPPA**: All data-capture forms require "I confirm I am 13 or older" checkbox
- **BNPL (Afterpay/Klarna)**: Gated behind 18+ confirmation — default to cards + Apple/Google Pay
- **GDPR**: Notify-me and waitlist forms require explicit marketing-consent checkbox

---

## Database

Supabase Postgres. Migrations in `supabase/migrations/` — never edit existing files, add new timestamped ones. Apply with `supabase db push`.

Key RPCs:
- `decrement_inventory(id)` — returns `boolean`; `false` = oversell (log alert)
- `increment_inventory(id)` — called on refund

---

## Environment Files

### Website (`the-bead-bar/.env.local`)

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

### App (`app/.env.local`)

```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_API_BASE_URL=https://<project>.supabase.co/functions/v1
```

`EXPO_PUBLIC_API_BASE_URL` must end in `/functions/v1` — the checkout screen appends `/checkout` (not `/api/checkout`).

### Supabase Secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set KLAVIYO_API_KEY=pk_...
supabase secrets set KLAVIYO_DROP_LIST_ID=...
supabase secrets set UPSTASH_REDIS_URL=https://...
supabase secrets set UPSTASH_REDIS_TOKEN=...
```

---

## Tests

### Website

```bash
cd the-bead-bar
npm test                          # Jest (unit + component)
npm run test:watch
npm run test:coverage
npm run test:e2e                  # Playwright (Mobile Chrome, Mobile Safari, Desktop Chrome)
npx jest __tests__/lib/builder/pricing.test.ts   # single file
```

### App

```bash
cd app
npm test                          # jest-expo preset
npm run test:watch
npm run test:coverage
```

Tests live in `__tests__/` mirroring `src/`. `data-testid` attributes are the primary query mechanism in both Jest/RTL and Playwright tests.

---

## Reference Docs

- `BUSINESS_SPEC.md` — full product, pricing, drop, and fulfillment spec
- `SYSTEM_DESIGN.md` — system architecture, data models, component map, tech stack decisions
- `the-bead-bar/CLAUDE.md` — website architecture details for AI assistants
- `app/CLAUDE.md` — app architecture details for AI assistants
