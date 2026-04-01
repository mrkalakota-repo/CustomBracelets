# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo for The Bead Bar — a D2C bracelet business. One git repo at this root level.

| Directory | What it is | Stack |
|---|---|---|
| `the-bead-bar/` | Website + PWA | Next.js 16, TypeScript, Tailwind, Stripe, Supabase |
| `app/` | iOS + Android native app | Expo SDK 54, Expo Router 6, React Native, NativeWind, Zustand |
| `supabase/functions/` | Edge Functions (serverless backend) | Deno, deployed to Supabase |

**Read the sub-project's `CLAUDE.md` before working in either directory.** Each has full architecture, env vars, and testing details.

## Commands

### Website (`the-bead-bar/`)

```bash
cd the-bead-bar
npm run dev              # dev server at localhost:3000
npm run build            # production build
npm run lint             # ESLint
npm test                 # Jest (unit + component)
npm run test:watch       # Jest watch mode
npm run test:e2e         # Playwright E2E (auto-starts dev server)
npx jest __tests__/lib/builder/pricing.test.ts   # single test file
npx playwright test e2e/builder-flow.spec.ts      # single E2E spec
```

### App (`app/`)

```bash
cd app
npx expo run:ios                    # first build — installs native deps (~5 min)
npx expo start --ios --clear        # subsequent iOS starts
npx expo start --android --clear    # subsequent Android starts
npm run lint
npx tsc --noEmit
cd ios && pod install --no-repo-update   # after adding native deps
```

**Never use `npx expo start` without `--ios` or `--android`** — web bundler fails. **Never use Expo Go** — requires a native dev build.

### Supabase Edge Functions (`supabase/functions/`)

```bash
# From repo root
supabase link --project-ref <project-ref>          # one-time link
supabase functions deploy checkout                  # deploy a function
supabase functions deploy klaviyo-subscribe         # deploy klaviyo function
supabase secrets set STRIPE_SECRET_KEY=sk_test_...  # set secrets (never in code)
supabase functions serve checkout                   # local dev
```

## Backend Architecture

Payment flow differs between web and app:

```
Website:  Browser → POST /api/checkout (Next.js route) → Stripe API
App:      React Native → POST supabase.co/functions/v1/checkout → Stripe API
```

The app **never** calls the website's API routes for payments — it uses the Supabase Edge Function directly so the website doesn't need to be running. The website has its own parallel checkout at `the-bead-bar/src/app/api/checkout/route.ts`.

The app's checkout screen reads `EXPO_PUBLIC_API_BASE_URL` as its base URL. In `.env.local` this is set to the Supabase functions base URL (`https://<project>.supabase.co/functions/v1`), so the checkout call becomes `.../functions/v1/checkout` — NOT `.../functions/v1/api/checkout`.

Klaviyo email signups from the app call the `klaviyo-subscribe` edge function (same base URL). Order tracking (`trackOrder`) is called from the website's order-confirmation page after a successful Stripe redirect.

## Shared Business Logic

Pricing logic exists in **three places** — changes must be made in all three:

| Logic | Website | App | Edge Function |
|---|---|---|---|
| Builder pricing | `the-bead-bar/src/lib/builder/pricing.ts` | `app/src/lib/builder/pricing.ts` | `supabase/functions/checkout/index.ts` (inlined) |
| Builder compatibility | `the-bead-bar/src/lib/builder/compatibility.ts` | `app/src/lib/builder/compatibility.ts` | — |
| Product catalog | `the-bead-bar/src/lib/products/catalog.ts` | `app/src/lib/products/catalog.ts` | — |

Prices are always **recalculated server-side** — client-supplied prices are ignored.

## Auth

Phone + 6-digit PIN via Supabase Auth (no email/password).

- **Sign-up flow**: `signUp` → Supabase sends OTP SMS → `verifyOtp` → session active
- **Sign-in flow**: `signInWithPassword(phone, pin)` → session active
- **Session storage**: `SecureStore` (app only). Website has no auth wired yet.
- **Navigation**: `sign-in` and `verify-phone` screens are `presentation: 'modal'`. After OTP verification, call `router.dismissAll()` then `router.replace('/(tabs)/profile')` to clear both modals and land on profile.

## App Navigation Patterns

Expo Router file-based routing. Root layout at `app/app/_layout.tsx`.

- Tab screens live in `app/app/(tabs)/` — always use full paths like `/(tabs)/drops`, not `/drops`
- `router.push('/some-screen')` from within a tab uses an **absolute path** and navigates to the root Stack, not within the tabs
- All non-tab screens must be registered with `<Stack.Screen name="...">` in `_layout.tsx` — unregistered screens may fall through to `+not-found`
- The builder opens as a modal (`presentation: 'modal'`); use `router.dismissAll()` to close it
- Modal screens (`sign-in`, `verify-phone`, `builder`) are dismissed with `router.back()` or `router.dismissAll()`

## React Native Pitfalls

- **No HTML entities in JSX text**: `&apos;`, `&amp;`, etc. render literally. Use template literals or Unicode escapes: `` `Didn\u2019t` `` or `{'\''}`.
- **Curly/smart apostrophes in string literals** (`'` instead of `'`) cause Metro bundler syntax errors. Use straight ASCII quotes in `.ts`/`.tsx` string literals.
- NativeWind v4: do **not** add `"nativewind/babel"` to `babel.config.js` plugins — use only `jsxImportSource: "nativewind"` in the preset.

## Compliance (applies to both projects)

- **COPPA**: All data-capture forms require an "I confirm I am 13 or older" checkbox
- **BNPL**: Afterpay/Klarna must be gated behind 18+ confirmation; default to cards + Apple/Google Pay
- **Compliance pages** (all implemented): Privacy Policy, Terms of Service, Returns, Shipping — on website at `/privacy-policy`, `/terms-of-service`, `/returns`, `/shipping`; on app at the same route names as screens

## Brand

- Colors: Cream `#F5F0E8`, Sage Green `#8FAF8A`, Soft Gold `#C9A96E`
- Audience: teen girls 13–17 (expanding over time)
- Price range: $10–25

## Reference Docs

- `BUSINESS_SPEC.md` — full product, pricing, drop, and fulfillment spec
- `SYSTEM_DESIGN.md` — system architecture, data models, component map, tech stack decisions
