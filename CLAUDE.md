# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo for The Bead Bar — a D2C bracelet business. Two separate projects, each with their own `CLAUDE.md`:

| Directory | What it is | Stack |
|---|---|---|
| `the-bead-bar/` | Website + PWA | Next.js 16, TypeScript, Tailwind, Stripe, Supabase |
| `app/` | iOS + Android native app | Expo SDK 54, Expo Router 6, React Native, NativeWind, Zustand |

Read the sub-project's `CLAUDE.md` before working in either directory.

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
