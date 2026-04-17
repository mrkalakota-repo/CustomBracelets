# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo for Chic Charm Co. — a D2C bracelet business. One git repo at this root level.

| Directory | What it is | Stack |
|---|---|---|
| `the-bead-bar/` | Website + PWA | Next.js 16, TypeScript, Tailwind, Stripe, Supabase |
| `app/` | iOS + Android native app | Expo SDK 54, Expo Router 6, React Native, NativeWind, Zustand |
| `supabase/functions/` | Edge Functions (serverless backend) | Deno, deployed to Supabase |

**Read the sub-project's `CLAUDE.md` before working in either directory.** Each has full architecture, env vars, and testing details. Note: `the-bead-bar/AGENTS.md` warns that Next.js 16 has breaking changes from common training data — check `node_modules/next/dist/docs/` for current API behavior before writing Next.js code.

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
npm test                            # Jest (jest-expo preset)
npm run test:watch
cd ios && pod install --no-repo-update   # after adding native deps
```

**Never use `npx expo start` without `--ios` or `--android`** — web bundler fails. **Never use Expo Go** — requires a native dev build.

### Supabase Edge Functions (`supabase/functions/`)

```bash
# From repo root
supabase link --project-ref <project-ref>          # one-time link
supabase functions deploy checkout                  # deploy a function
supabase functions deploy klaviyo-subscribe         # deploy klaviyo function
supabase functions deploy stripe-webhook            # deploy webhook handler
supabase secrets set STRIPE_SECRET_KEY=sk_test_...  # set secrets (never in code)
supabase secrets set UPSTASH_REDIS_URL=https://...  # distributed rate limiting
supabase secrets set UPSTASH_REDIS_TOKEN=...        # distributed rate limiting
supabase functions serve checkout                   # local dev
supabase db push                                    # apply pending migrations
```

**Upstash Redis** is used by the `checkout` edge function for distributed rate limiting (replaces in-memory Map which resets per isolate). If `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` are not set, the function logs a warning and allows the request — graceful degradation.

## Backend Architecture

Payment flow differs between web and app:

```
Website:  Browser → POST /api/checkout (Next.js route) → Stripe API
App:      React Native → POST supabase.co/functions/v1/checkout → Stripe API
```

The app **never** calls the website's API routes for payments — it uses the Supabase Edge Function directly so the website doesn't need to be running. The website has its own parallel checkout at `the-bead-bar/src/app/api/checkout/route.ts`.

The app's checkout screen reads `EXPO_PUBLIC_API_BASE_URL` as its base URL. In `.env.local` this is set to the Supabase functions base URL (`https://<project>.supabase.co/functions/v1`), so the checkout call becomes `.../functions/v1/checkout` — NOT `.../functions/v1/api/checkout`.

Klaviyo email signups from the app call the `klaviyo-subscribe` edge function (same base URL). Order tracking (`trackOrder`) is called from the website's order-confirmation page after a successful Stripe redirect.

**Edge Functions:**
- `checkout` — creates Stripe PaymentIntent, recalculates prices server-side
- `klaviyo-subscribe` — subscribes email to a Klaviyo drop list
- `stripe-webhook` — handles `payment_intent.succeeded` (creates `orders` + `order_items`, decrements inventory via `decrement_inventory` RPC) and `charge.refunded` (restores inventory via `increment_inventory` RPC, marks order `refunded`)

**`decrement_inventory` RPC** returns `boolean` — `true` if stock was successfully decremented, `false` if insufficient stock (OVERSELL). Always check the return value and log an oversell alert.

**Database migrations** live in `supabase/migrations/`. Apply with `supabase db push`. Migration files are prefixed with a timestamp; do not edit existing migrations — add new ones.

## Shared Business Logic

Pricing logic exists in **three places** — changes must be made in all three:

| Logic | Website | App | Edge Function |
|---|---|---|---|
| Builder pricing | `the-bead-bar/src/lib/builder/pricing.ts` | `app/src/lib/builder/pricing.ts` | `supabase/functions/checkout/index.ts` (inlined) |
| Builder compatibility | `the-bead-bar/src/lib/builder/compatibility.ts` | `app/src/lib/builder/compatibility.ts` | — |
| Product catalog | **Supabase `products` table** (website reads DB) | `app/src/lib/products/catalog.ts` (still static) | — |

`BaseStyle` is `'beaded' | 'string' | 'chain' | 'stackable'` — `'cord'` was renamed to `'string'` and `'charm'` was removed as a base style. Charm is still available as an **add-on** (`addOns.charm`) on any base style. The internal DB/code value for the chain style remains `'chain'`; the **display label** everywhere (admin dropdown, builder step, shop filter, share card) is `'Charm'`.

Prices are always **recalculated server-side** — client-supplied prices are ignored.

**The website product/drop/banner catalog is now database-driven.** The static arrays `ALL_PRODUCTS` and `DROP_REGISTRY` no longer exist — use `getAllProducts()`, `getProductById()`, `getAllDrops()`, `getDropById()` (all async, in `catalog.ts` / `registry.ts`). Banners are in `src/lib/banners/banners.ts`. The app still uses hardcoded static arrays.

**Dynamic rendering on live-data pages**: any page that reads from the database and must reflect real-time changes (homepage, all admin pages) must export `export const dynamic = 'force-dynamic'`. Without it, Next.js statically renders the page at build time on Amplify and new DB records won't appear until the next deployment. The homepage (`app/page.tsx`) and admin layout (`app/admin/layout.tsx`) already have this.

## Auth

Phone + 6-digit PIN via Supabase Auth (no email/password).

- **Sign-up flow**: `signUp` → Supabase sends OTP SMS → `verifyOtp` → session active
- **Sign-in flow**: `signInWithPassword(phone, pin)` → session active
- **Change PIN flow**: `updatePin(currentPin, newPin)` — verifies current PIN via `signInWithPassword` first, then calls `supabase.auth.updateUser({ password: newPin })`. Website page at `/profile/change-pin`.
- **Forgot PIN**: triggers OTP via `resendOtp`, then `/verify-phone?action=reset` sets a new PIN after verification.
- **Session storage**: `SecureStore` (app). Website uses Supabase's default browser `localStorage` storage.
- **Website auth**: `src/context/AuthContext.tsx` + `src/lib/supabase/client.ts`. Pages: `/sign-in`, `/verify-phone`, `/profile`, `/profile/change-pin`. Sign-in and verify-phone are full-page routes (not modals). After OTP verification, `router.replace('/profile')`.
- **App navigation**: `sign-in` and `verify-phone` screens are `presentation: 'modal'`. After OTP verification, call `router.dismissAll()` then `router.replace('/(tabs)/profile')` to clear both modals and land on profile.
- **Admin auth**: `ADMIN_PHONE` env var designates the owner's account. `verifyAdminAuth()` in `src/lib/supabase/adminAuth.ts` validates Bearer tokens on all admin API routes. Client-side `AdminGuard` component gates the `/admin` UI.

## App Navigation Patterns

Expo Router file-based routing. Root layout at `app/app/_layout.tsx`.

- Tab screens live in `app/app/(tabs)/` — always use full paths like `/(tabs)/drops`, not `/drops`
- `router.push('/some-screen')` from within a tab uses an **absolute path** and navigates to the root Stack, not within the tabs
- All non-tab screens must be registered with `<Stack.Screen name="...">` in `_layout.tsx` — unregistered screens may fall through to `+not-found`
- The builder opens as a modal (`presentation: 'modal'`); use `router.dismissAll()` to close it
- Modal screens (`sign-in`, `verify-phone`, `builder`) are dismissed with `router.back()` or `router.dismissAll()`

## Admin Dashboard (`/admin`)

Owner-only UI at `/admin` for managing products, drops, and banners without code changes.

- **Access**: gated by `AdminGuard` (client component, checks `user.phone === NEXT_PUBLIC_ADMIN_PHONE`). Middleware at `src/middleware.ts` adds rate limiting (60 req/min/IP) and `X-Robots-Tag: noindex` headers. `robots.txt` also disallows `/admin`.
- **API routes**: all under `src/app/api/admin/`. Every route follows: `rateLimit()` → `verifyAdminAuth()` → Zod parse → Supabase query.
- **Required env vars**: `SUPABASE_SERVICE_ROLE_KEY` (service_role secret JWT, not anon key), `ADMIN_PHONE` (E.164 format matching `auth.users.phone`), `NEXT_PUBLIC_ADMIN_PHONE` (same value, build-time inlined for AdminGuard).
- **Activation rule**: only one banner is active at a time — activating one auto-deactivates all others.
- **Mutations from client components**: always call `router.refresh()` after a successful fetch mutation to re-run Server Component data fetching.
- **Image uploads**: `POST /api/admin/upload` accepts `multipart/form-data` with a `file` field, validates admin auth, uploads to the `product-images` Supabase Storage bucket, and returns `{ url }`. The shared `ImageUpload` component (`src/components/Admin/ImageUpload.tsx`) handles file picking, upload, and preview — used by `ProductForm` and `DropForm`.
- **Dynamic rendering**: the admin layout exports `export const dynamic = 'force-dynamic'`, which cascades to all admin pages so they always serve live DB data rather than a stale static build.

## Supabase Client Architecture

Three distinct clients — use the right one for the context:

| Client | File | Used for |
|--------|------|----------|
| Browser anon | `src/lib/supabase/client.ts` | All client components, `AuthContext` |
| Server anon | `src/lib/supabase/anon-server.ts` | Server Components reading public data (products, drops, banners) |
| Server service-role | `src/lib/supabase/server.ts` | Admin API routes — bypasses RLS, **never expose to browser** |

Both server clients use a `noopStorage` adapter (no file-based DB in Node.js) and factory functions (`createAnonServerClient()` / `createServerSupabaseClient()`) — no singletons, fresh client per request.

## Database Tables

All in `supabase/migrations/`. Never edit existing migration files — always add new ones.

| Table | Key columns | Notes |
|-------|-------------|-------|
| `products` | id (text PK), name, type (enum), price, image_url, occasion, description | Public SELECT via RLS; admin writes via service-role |
| `drops` | id (text PK), name, theme, launch_date, stock, preview_image_url, product_ids (text[]), social_copy | Same RLS pattern |
| `banners` | id (serial PK), message, cta_label, cta_url, bg_color (sage/gold/cream), is_active | Only one `is_active=true` at a time |
| `orders` / `order_items` | — | Written by `stripe-webhook` edge function |
| `inventory` | id, name, quantity | Decremented by `decrement_inventory` RPC (returns bool — check for oversell) |

**Supabase Storage bucket**: `product-images` (public). Holds product and drop preview images uploaded via the admin dashboard. Public URLs follow the pattern `https://<project>.supabase.co/storage/v1/object/public/product-images/<filename>`. `next.config.ts` has a `remotePatterns` entry for `*.supabase.co` so `next/image` accepts these URLs.

**Migration idempotency**: all `CREATE TABLE` statements use `IF NOT EXISTS`; all `CREATE POLICY` statements are preceded by `DROP POLICY IF EXISTS` (PostgreSQL does not support `CREATE POLICY IF NOT EXISTS`).

## Known API Pitfalls

### Klaviyo (applies to both web and edge function)

The Klaviyo `profile-subscription-bulk-create-jobs` endpoint (revision `2023-12-15`) rejects any field other than `email` inside `profile.attributes`. Do **not** include `source`, `first_name`, or any other field there — it returns HTTP 400.

```ts
// Correct
data: [{ type: 'profile', attributes: { email } }]
```

Both `the-bead-bar/src/lib/klaviyo/client.ts` and `supabase/functions/klaviyo-subscribe/index.ts` must follow this pattern.

### Supabase anon key format

Edge functions require the legacy JWT format (`eyJ...`) in the `Authorization` header. The newer `sb_publishable_...` format is for the Supabase client library only — using it directly in `fetch` headers returns 401 "Invalid Token or Protected Header formatting".

### TypeScript null narrowing in `'use client'` async handlers

TypeScript loses null narrowing from outer scope inside async closures. Capture values in a `const` before defining handler functions:

```ts
// DropRoute.tsx — drop is narrowed to non-null here
const dropId = drop.id  // capture before async closures

async function handleNotify(email: string) {
  // drop.id would be a TS error here — use dropId instead
  body: JSON.stringify({ email, dropId })
}
```

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
