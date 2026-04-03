# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First build (required once — installs native deps, ~5 min)
npx expo run:ios

# Subsequent starts — ALWAYS specify platform, never use plain `expo start`
npx expo start --ios --clear
npx expo start --android --clear

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

**Never use `npx expo start` without `--ios` or `--android`** — it triggers the web bundler which fails with `Unable to resolve "../../App" from "node_modules/expo/AppEntry.js"` because this project has no web entry point.

**Never use Expo Go** — expo-router 6 requires a native development build (`npx expo run:ios`). Expo Go will always fail with the same AppEntry error regardless of version.

When adding CocoaPods for new native deps:
```bash
cd ios && pod install --no-repo-update
```
The Podfile uses `source 'https://cdn.cocoapods.org/'` — always pass `--no-repo-update` to skip the slow Git specs repo sync.

No test runner is configured yet. When adding tests, use Jest with `jest-expo`.

## Environment

Create `.env.local` in the project root:
```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

All `EXPO_PUBLIC_` variables are inlined at build time and safe to read client-side.

## Architecture

**Expo SDK 54, managed workflow, Expo Router 6** (file-based routing). Brand colors: Cream `#F5F0E8`, Sage Green `#8FAF8A`.

### Routing (`app/`)

- `app/(tabs)/` — bottom tab navigator (Home, Shop, Drops, Profile)
- `app/builder/` — 5-screen modal stack (index → color → pattern → addons → preview)
- `app/product/[id].tsx` — dynamic product detail
- `app/cart.tsx`, `app/checkout.tsx`, `app/order-confirmation.tsx` — checkout flow
- `app/_layout.tsx` — root layout; wraps everything in `StripeProvider` + `SafeAreaProvider`

The builder opens as a modal (`presentation: 'modal'`). Use `router.dismissAll()` to close it, then navigate away. Tab routes must use full paths e.g. `/(tabs)/drops` not `/drops`.

### State (`src/store/`)

- **`cart.ts`** — `CartItem[]`, `addProduct()`, `addCustom()`, `removeItem()`, `total()`, `itemCount()`. Supports both catalog products and custom-built bracelets.
- **`builder.ts`** — 5-step state (`baseStyle → primaryColor → accentPattern → addOns`). `setBaseStyle()` resets all downstream steps via `resetFromStep()`. `currentStep()` derives current step. `charm` base skips step 3 (no patterns).

### Shared Logic (`src/lib/`)

Copied from `../the-bead-bar/src/lib/` — **must stay in sync with the website**:

- `builder/compatibility.ts` — `getCompatiblePatterns(base)` drives Step 3 options. Changing base resets steps 2–4.
- `builder/pricing.ts` — `calculatePrice(base, addOns)`. BFF duo = `price * 2 - 2`.
- `products/catalog.ts` — `ALL_PRODUCTS`, `getProductById()`. `imageUrl` is a bare key string (images not yet wired up).
- `drops/registry.ts` — drop schedule, `getActiveOrUpcomingDrop()` drives the home screen drop strip.

### Styling

NativeWind v4 — Tailwind class names on React Native components.

- Custom tokens in `tailwind.config.js`: `cream`, `sage`, `sage-dark`, `cream-dark`, `soft-gold`
- `presets: [require('nativewind/preset')]` in `tailwind.config.js` is required — removing it breaks Metro
- `"nativewind/babel"` must NOT be in `babel.config.js` plugins — NativeWind v4 uses only `jsxImportSource: "nativewind"` in the preset. Adding it as a plugin causes `.plugins is not a valid Plugin property` crash
- Import `src/styles/global.css` only in `app/_layout.tsx`

### Payments

`@stripe/stripe-react-native` configured via `app.json` plugin. `StripeProvider` in `app/_layout.tsx` reads `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`. The checkout screen calls `${EXPO_PUBLIC_API_BASE_URL}/checkout` — the Supabase Edge Function, **not** the website's API routes. The base URL already ends in `/functions/v1`, so the path must be just `/checkout` (not `/api/checkout`).

### Key Constraints

- Portrait-only (`"orientation": "portrait"` in `app.json`)
- COPPA: all data-capture forms need "I confirm I am 13 or older" checkbox
- BNPL: Afterpay/Klarna gated behind 18+ — default to cards + Apple/Google Pay
