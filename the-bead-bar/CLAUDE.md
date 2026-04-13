# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server at localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm test             # Jest (unit + component tests)
npm run test:watch   # Jest in watch mode
npm run test:coverage # Jest with coverage report
npm run test:e2e     # Playwright E2E (starts dev server automatically)
```

Run a single Jest test file:
```bash
npx jest __tests__/lib/builder/pricing.test.ts
```

Run a single Playwright spec:
```bash
npx playwright test e2e/builder-flow.spec.ts
```

## Required environment variables

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
KLAVIYO_API_KEY=pk_...
# Optional — Klaviyo list IDs (API returns 503 if called without these)
KLAVIYO_DROP_LIST_ID=...
KLAVIYO_WAITLIST_LIST_ID=...
KLAVIYO_MARKETING_LIST_ID=...
# Optional — Cloudflare Turnstile bot protection
# Widget renders nothing and verification is skipped if these are absent (dev-safe)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...   # inlined at build time
TURNSTILE_SECRET_KEY=...             # server-side only
```

Cloudflare provides always-pass test keys for staging: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

Server-side secrets (`STRIPE_SECRET_KEY`, `KLAVIYO_API_KEY`) are validated lazily at first request via `src/lib/env.ts` (Zod schema, Proxy-based). Missing required keys throw a clear error at runtime, not at build time. `NEXT_PUBLIC_*` vars are inlined at build time by Next.js.

## Architecture

**Next.js 16 App Router** with React 19. All pages in `src/app/` are Server Components by default; components that need state or browser APIs are marked `'use client'`.

### Layer separation

| Layer | Path | Purpose |
|---|---|---|
| Pages | `src/app/**/page.tsx` | Thin wrappers — import and render one component from `src/components/` |
| Components | `src/components/` | All UI logic lives here. Named exports, not default exports. |
| Lib | `src/lib/` | Pure business logic with no React dependencies. Tested independently. |
| API routes | `src/app/api/` | Next.js route handlers. One file per endpoint. |
| Context | `src/context/CartContext.tsx` | Global cart state via React Context + useReducer. |
| Auth context | `src/context/AuthContext.tsx` | Supabase phone+PIN auth. Wraps entire app in `layout.tsx`. |
| Supabase client | `src/lib/supabase/client.ts` | Browser Supabase client (uses `NEXT_PUBLIC_*` vars, localStorage session). |

### Key domain models

**Builder** (`src/lib/builder/`)
- `compatibility.ts` — `BaseStyle` type (`'beaded' | 'string' | 'chain' | 'stackable'`), `COMPATIBLE_PATTERNS` map, `getCompatiblePatterns()`, `isValidCombo()`, `resetFromStep()`
- `pricing.ts` — `BASE_PRICES`, `ADDON_PRICES`, `calculatePrice()`. BFF duo = `price * 2 - 2`. Charm is an add-on (`ADDON_PRICES.charm = 3`), not a base style.
- `BuilderFlow.tsx` — 5-step wizard: base → color → pattern → add-ons → preview. `selectBase()` resets all downstream state.

**Drops** (`src/lib/drops/`)
- `state.ts` — `DropState` enum (`UPCOMING | LIVE | SOLD_OUT | ENDED`), `getDropState(launchDate, stock, now)`. A drop moves to `ENDED` when stock=0 and >7 days have passed since launch.
- `registry.ts` — `DROP_REGISTRY` array of `Drop` objects; `getDropById()`.
- `DropRoute.tsx` — derives state via `getDropState()` then renders `DropPage`. Handles null drop (404-like).

**Cart** (`src/lib/cart/`, `src/context/CartContext.tsx`)
- `cartTypes.ts` — `CartItem`, `cartTotal()`, `shippingCost()` (free ≥ $20), `orderTotal()`.
- `CartContext.tsx` — persists to `localStorage` key `chic-charm-cart`, hydrates on mount via `HYDRATE` action. Parse errors clear the corrupted key and log a warning. Throws if `useCart()` is called outside `CartProvider`.

**Products** (`src/lib/products/catalog.ts`)
- `ALL_PRODUCTS` — single source of truth for the product catalog. Consumed by the home page (featured subset), shop page (full list), and product detail pages.
- `getProductById(id)` — lookup used by `src/app/shop/[id]/page.tsx`.
- Images are SVGs in `public/images/`; all paths reference `.svg` files. `next.config.ts` enables `dangerouslyAllowSVG`.

**Payments** (`src/app/api/checkout/route.ts`, `src/lib/stripe/client.ts`)
- Server: creates a Stripe `PaymentIntent`. **Item prices are always recalculated server-side** via `calculatePrice()` — the client-supplied `price` field is ignored. Amount is in cents. Returns `{ clientSecret }`.
- Client: `CheckoutWrapper` fetches the client secret on mount, then renders `<Elements>` with `StripeCheckoutForm` inside. `StripeCheckoutForm` mounts `PaymentElement` + `ExpressCheckoutElement` and calls `stripe.confirmPayment()` on submit, redirecting to `/order-confirmation` on success.
- `src/lib/stripe/client.ts` — singleton `loadStripe()` using `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- `CheckoutPage` accepts an optional `paymentSection` prop so tests can inject stub payment UI without needing Stripe.js.
- Test files require `/** @jest-environment node */` at the top (Web `Request` is unavailable in jsdom).

**Klaviyo** (`src/lib/klaviyo/client.ts`, `src/app/api/klaviyo/`)
- `subscribeToList()` — adds email to a Klaviyo list (Klaviyo REST API revision `2023-12-15`).
- `trackOrder()` — fires an order event.
- Two API routes: `POST /api/klaviyo/subscribe` and `POST /api/klaviyo/order`.

**Shared utilities** (`src/lib/`)
- `env.ts` — Zod-validated environment variables. Import `env` (not `process.env`) in API routes to get typed, validated values.
- `rateLimit.ts` — in-memory sliding-window rate limiter. Used by all three API routes.

### Security patterns

Every API route must:
1. Call `rateLimit()` before processing — returns `false` → respond 429.
2. Parse the request body through a Zod schema — invalid input → respond 400 with the first issue message.
3. Import secrets from `env` (not `process.env` directly).

The checkout route additionally recalculates all item prices server-side; never trust client-supplied prices.

**Turnstile** (`src/lib/turnstile.ts`, `src/components/Turnstile/TurnstileWidget.tsx`): bot protection on drop subscription forms. `TurnstileWidget` renders nothing when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is unset — forms still work in dev. `/api/klaviyo/subscribe` verifies the token server-side via `verifyTurnstileToken()`; gracefully skips verification if `TURNSTILE_SECRET_KEY` is unset. The Jest mock lives at `__mocks__/@marsidev/react-turnstile.tsx`.

### Compliance rules (must not be removed)

- **COPPA**: Every data-capture form (notify-me, waitlist) includes `AgeGateForm` with `minAge=13`.
- **BNPL age gate**: Afterpay/Klarna in `CheckoutPage` is hidden behind `AgeGateForm` with `minAge=18`.
- **GDPR**: Both `NotifyMeForm` and `WaitlistForm` require an explicit marketing-consent checkbox before submit. Handlers are typed `(email: string, turnstileToken?: string) => Promise<void> | void` — always await them and surface errors to the user.

### Styling

`src/app/globals.css` defines all brand tokens as CSS custom properties and Tailwind theme extensions:
- Colors: `--cream` `#F5F0E8`, `--sage` `#8FAF8A`, `--gold` `#C9A84C`
- Utility classes: `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.filter-btn`, `.step-dot`, `.badge-live`, `.badge-sold-out`, `.page-container`, `.section`, `.grid-2`

Use these classes rather than one-off Tailwind values for brand consistency.

### Images

Use `next/image` with `fill` + a `relative`-positioned container for all product and drop images. Always include a `sizes` attribute. Raw `<img>` tags are not permitted.

### Dynamic route pages

In Next.js 15+, `params` in server component page functions is a **Promise** — always `await` it before accessing properties:

```ts
// app/shop/[id]/page.tsx
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // ...
}
```

This applies to every `app/**/[param]/page.tsx`. Using `params.id` synchronously throws at runtime.

### PWA

- `public/manifest.json` — name, icons (192, 512), shortcuts to `/builder` and `/shop`.
- `public/sw.js` — Cache First for static assets + `/_next/image`, Network Only for API/checkout/drops, Network First for product pages. Also handles Web Push.
- `src/components/PwaInit.tsx` — client component that registers the service worker.
- **PWA requires a production build** — `npm run build && npm run start`. The service worker does not activate in `npm run dev`.
- **Service worker rule**: `FetchEvent.respondWith` must always receive a `Response` — never `undefined`. Safari crashes hard on null; Chrome silently ignores it. Always provide a fallback: `cached ?? new Response('Offline', { status: 503 })`.
- **`useSearchParams` requires `<Suspense>`** — any page component calling `useSearchParams()` must be split into an inner component wrapped in `<Suspense>` in the page export, otherwise the build fails with a prerender error.

### Error handling

`src/app/error.tsx` is the root error boundary for the App Router. It catches unhandled errors in the render tree and shows a "Try again" button that calls `reset()`.

### Code splitting

The builder and checkout pages use `next/dynamic` to split their component bundles and show a loading fallback during client-side navigation.

### Testing conventions

- **Unit/component tests**: `__tests__/` mirroring `src/` structure. Jest + React Testing Library. Default env is `jsdom`.
- **API route tests**: Add `/** @jest-environment node */` as the first line.
- **E2E**: `e2e/` directory, Playwright, runs against Mobile Chrome + Mobile Safari + Desktop Chrome.
- `data-testid` attributes are the primary query mechanism in both RTL and Playwright tests.
