# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo for The Bead Bar — a D2C bracelet business. One git repo at this root level.

| Directory | What it is | Stack |
|---|---|---|
| `the-bead-bar/` | Website + PWA | Next.js 16, TypeScript, Tailwind, Stripe, Supabase |
| `app/` | iOS + Android native app | Expo SDK 54, Expo Router 6, React Native, NativeWind, Zustand |

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

## Shared Business Logic

Both projects share identical copies of these files — **changes must be made in both places**:

| Logic | Website path | App path |
|---|---|---|
| Builder compatibility | `the-bead-bar/src/lib/builder/compatibility.ts` | `app/src/lib/builder/compatibility.ts` |
| Builder pricing | `the-bead-bar/src/lib/builder/pricing.ts` | `app/src/lib/builder/pricing.ts` |
| Product catalog | `the-bead-bar/src/lib/products/catalog.ts` | `app/src/lib/products/catalog.ts` |

The app calls the website's API routes directly for payments and Klaviyo — there is no separate backend.

## Brand

- Colors: Cream `#F5F0E8`, Sage Green `#8FAF8A`, Soft Gold `#C9A96E`
- Audience: teen girls 13–17 (expanding over time)
- Price range: $10–25

## Compliance (applies to both projects)

- **COPPA**: All data-capture forms require an "I confirm I am 13 or older" checkbox
- **BNPL**: Afterpay/Klarna must be gated behind 18+ confirmation; default to cards + Apple/Google Pay
- **Privacy Policy, Terms of Service, Returns, Shipping** pages must exist before launch

## Reference Docs

- `BUSINESS_SPEC.md` — full product, pricing, drop, and fulfillment spec
- `SYSTEM_DESIGN.md` — system architecture, data models, component map, tech stack decisions
