# Bracelet Business — System Design
_Generated: 2026-03-29 | Based on: BUSINESS_SPEC.md_

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER LAYER                               │
│   TikTok / Instagram / Pinterest  →  Social Share Cards         │
│              ↓ link tap                                         │
│   Mobile Browser  ──────────────────────  Desktop Browser       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────────┐
│                    FRONTEND LAYER                               │
│                                                                 │
│   Shopify Storefront (Phase 1)                                  │
│   ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌────────────────┐    │
│   │  Home    │ │  Shop   │ │ Builder  │ │  Drop Page     │    │
│   │  Page    │ │ Catalog │ │  Flow    │ │  + Countdown   │    │
│   └──────────┘ └─────────┘ └──────────┘ └────────────────┘    │
│   ┌──────────┐ ┌─────────┐ ┌──────────┐                        │
│   │  Cart /  │ │  About  │ │ Policies │                        │
│   │ Checkout │ │  Page   │ │ (Legal)  │                        │
│   └──────────┘ └─────────┘ └──────────┘                        │
│                                                                 │
│   PWA Layer (Phase 2 — added on top)                           │
│   manifest.json + service-worker.js + web push                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ Shopify API
┌────────────────────────▼────────────────────────────────────────┐
│                   SHOPIFY BACKEND LAYER                         │
│                                                                 │
│  Products & Variants   Orders & Fulfillment   Customer Accounts │
│  Inventory Management  Discount Codes          Metafields       │
│  Shopify Payments      Shopify Shipping        Analytics        │
└──────┬─────────────────────┬───────────────────────┬───────────┘
       │                     │                       │
┌──────▼──────┐    ┌─────────▼────────┐   ┌─────────▼──────────┐
│  PAYMENT    │    │  EMAIL / SMS     │   │   ADMIN TOOLS      │
│  LAYER      │    │  MARKETING       │   │                    │
│             │    │                  │   │  Shopify Admin     │
│  Stripe     │    │  Klaviyo         │   │  Order Dashboard   │
│  Apple Pay  │    │  - Drop alerts   │   │  Inventory Tracker │
│  Google Pay │    │  - Waitlist      │   │  (Google Sheet     │
│  Afterpay   │    │  - Post-purchase │   │   at Phase 1)      │
│  Klarna     │    │  - Abandoned     │   │                    │
│  (18+ gate) │    │    cart          │   │  Pirateship.com    │
└─────────────┘    └──────────────────┘   │  (shipping labels) │
                                          └────────────────────┘
```

---

## 2. Page Architecture & Component Map

### 2.1 Home Page
```
┌─────────────────────────────────────┐
│  HEADER                             │
│  [Logo]  [Shop] [Drops] [Builder] [Cart] │
├─────────────────────────────────────┤
│  HERO BANNER                        │
│  "New Drop: [Name]" + CTA button    │
│  Background: wrist photo or flat lay│
├─────────────────────────────────────┤
│  ACTIVE DROP STRIP (if live)        │
│  Drops in: 02:14:33  [See Drop]    │
├─────────────────────────────────────┤
│  SHOP BY CATEGORY                   │
│  [Beaded] [Cord] [Chain] [Stackable]│
├─────────────────────────────────────┤
│  FEATURED / BESTSELLERS (4 items)   │
├─────────────────────────────────────┤
│  UGC GALLERY STRIP (Phase 2)        │
│  Customer photos w/ #WristCheck     │
├─────────────────────────────────────┤
│  BUILD YOUR OWN CTA                 │
│  "Design your bracelet →"           │
├─────────────────────────────────────┤
│  BFF SET PROMO BANNER               │
│  "Match with your bestie"           │
├─────────────────────────────────────┤
│  FOOTER                             │
│  About | Returns | Shipping         │
│  Privacy Policy | Terms of Service  │
│  TikTok | Instagram | Pinterest     │
└─────────────────────────────────────┘
```

### 2.2 Builder Flow (Core Feature)
```
STEP 1           STEP 2           STEP 3           STEP 4          STEP 5
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Choose   │ →  │ Primary  │ →  │ Accent / │ →  │ Add-ons  │ →  │ Preview  │
│ Base     │    │ Color    │    │ Pattern  │    │ (opt.)   │    │ + Share  │
│ Style    │    │          │    │          │    │          │    │ + Cart   │
│          │    │ Curated  │    │ 3-5 opts │    │ Charm    │    │          │
│ Beaded   │    │ palette  │    │ per base │    │ Text     │    │ 1080px   │
│ Cord     │    │ per      │    │ (only    │    │ Gift     │    │ card     │
│ Chain    │    │ season   │    │ compat.) │    │ wrap     │    │ generated│
│ Charm    │    │          │    │          │    │ Rush     │    │          │
│ Stackable│    │          │    │          │    │          │    │ Share →  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     ↑ changing base resets steps 2-4 (compatibility logic)
```

**Builder State Machine:**
```
idle → step1_selected → step2_selected → step3_selected
                                              ↓
                                    [skip add-ons] or [add-ons_selected]
                                              ↓
                                         preview_ready
                                         ↙         ↘
                                   share_card    add_to_cart
```

### 2.3 Drop Page States
```
STATE: Upcoming (before launch)
  - Countdown timer
  - Blurred sneak peek image
  - "Notify me" form with age confirmation checkbox

STATE: Live
  - "LIVE NOW" badge
  - Product grid with real-time stock indicators
  - Urgency: "Only 3 left"

STATE: Sold Out
  - "SOLD OUT" badge
  - Waitlist signup form with age confirmation checkbox
  - "You might also like" → core catalog products
```

---

## 3. Data Model (Shopify-native)

### 3.1 Product Structure
```
Product
├── title: "Custom Beaded Bracelet"
├── product_type: "beaded" | "cord" | "chain" | "charm" | "stackable"
├── tags: ["minimalist", "spring-drop", "limited", "bff-set"]
├── metafields:
│   ├── drop_id: "spring-bloom-2026"
│   ├── drop_launch_date: "2026-04-15T12:00:00Z"
│   ├── is_limited: true | false
│   └── collection_type: "seasonal" | "occasion" | "limited" | "core"
└── variants[]
    ├── option1: base_style  ("beaded")
    ├── option2: primary_color ("sage-green")
    ├── option3: accent_pattern ("cream-stripe")
    ├── price: 12.00
    ├── inventory_quantity: 5
    └── sku: "BRC-BEA-SGR-CRS"
```

### 3.2 Order + Custom Specs
```
Order
├── line_items[]
│   ├── variant_id
│   ├── quantity
│   └── properties[]
│       ├── "Base Style": "beaded"
│       ├── "Primary Color": "sage green"
│       ├── "Accent Pattern": "cream stripe"
│       ├── "Charm": "star"
│       ├── "Custom Text": "BFF"
│       └── "Is BFF Set": "yes / bracelet 1 of 2"
├── customer { email, name, age_confirmed: true }
├── shipping_address
└── note: "Rush order"
```

### 3.3 Drop Schedule
```
Drop (Shopify Metaobject or Google Sheet at Phase 1)
├── id: "spring-bloom-2026"
├── name: "Spring Bloom"
├── theme: "pastel florals, friendship"
├── launch_date: "2026-04-15T12:00:00Z"
├── status: "upcoming" | "live" | "sold_out" | "ended"
├── products[]: [product_id_1, product_id_2]
├── waitlist_count: 142
└── social_copy: "Spring is here 🌸 New drop [date]..."
```

---

## 4. Builder Compatibility Matrix

```
Base Style    → Compatible Patterns
─────────────────────────────────────────────────────
beaded        → solid, two-tone, gradient, checker, stripe
cord/string   → solid, knotted, braided, dip-dye
chain         → plain, with-charm-only, twisted
charm         → plain-chain + charms (auto-routes to step 4)
stackable     → mix of above (3 separate mini-selections)
```

Rule: selecting a base in Step 1 filters Step 3 options to compatible patterns only.
Changing Step 1 resets Steps 2–4.

---

## 5. Shareable Card Design

```
┌─────────────────────────────┐
│  [Brand Logo]               │
│                             │
│     ┌─────────────────┐     │
│     │  Bracelet       │     │
│     │  Preview Image  │     │
│     │  (rendered from │     │
│     │  selected combo)│     │
│     └─────────────────┘     │
│                             │
│  "Sage Green / Cream Stripe"│
│  "Custom Beaded Bracelet"   │
│                             │
│  [brandname].com            │
└─────────────────────────────┘
        1080 × 1080px
```

**Implementation (Phase 1):**
- `html2canvas` or `dom-to-image` screenshots the styled builder preview div
- Web Share API (`navigator.share()`) triggers native share sheet
- Falls back to download link on unsupported browsers

---

## 6. PWA Architecture (Phase 2)

### manifest.json
```json
{
  "name": "[Brand Name]",
  "short_name": "[Brand]",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F0E8",
  "theme_color": "#8FAF8A",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Cache Strategy
```
Static assets (CSS, fonts, logo)  → Cache First
Product pages                     → Network First, fallback to cache
Drop countdown page               → Network Only (must be real-time)
Checkout pages                    → Network Only (never cache payments)
Builder                           → Cache First (assets), Network for product data
```

### Push Notification Flow
```
User visits site
      ↓
"Get notified for drops?" browser prompt
      ↓
User grants permission
      ↓
Browser generates push subscription token
      ↓
Token saved to Klaviyo (web push channel)
      ↓
Drop day → Klaviyo sends push to all subscribers
      ↓
Phone notification: "Spring Bloom is LIVE 🌸 Shop now →"
```

---

## 7. Confirmed Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14 (App Router)** | Full control, TDD-friendly, Claude Code natural fit |
| Language | **TypeScript** | Type safety across builder logic and data models |
| Styling | **Tailwind CSS** | Rapid mobile-first UI, consistent design tokens |
| Payments | **Stripe** (Checkout + Elements) | Handles PCI, Apple Pay, Google Pay, Afterpay, Klarna |
| Email / SMS | **Klaviyo** | Drop alerts, waitlist, abandoned cart, post-purchase |
| Database | **Postgres via Supabase** | Orders, products, drops, waitlist (free tier sufficient at launch) |
| Hosting | **Vercel** | Zero-config Next.js deploys, ~$20/month |
| Shipping labels | **Pirateship** | Cheapest USPS rates, manual at Phase 1 |
| PWA (Phase 2) | **next-pwa** | Built-in, adds manifest + service worker to Next.js |
| Analytics | **Google Analytics 4** | Free, sufficient for Phase 1 |
| Unit Testing | **Jest + React Testing Library** | TDD for all logic and components |
| E2E Testing | **Playwright** | Full browser testing for builder, checkout, drop flows |
| Native App (Phase 3) | **React Native** | Conditional on growth metrics |

---

## 8. Performance Budget

Target: under 2 seconds on 4G mobile

```
HTML:          < 15KB
CSS:           < 50KB (critical CSS inlined, rest deferred)
JavaScript:    < 100KB (code-split, lazy-loaded below fold)
Images:        WebP format, lazy-loaded below fold
               Hero: 800px wide max
               Thumbnails: 400px wide max
Fonts:         Max 2 custom fonts, font-display: swap
Third-party:   No render-blocking scripts on first paint
               Analytics loaded async
               Klaviyo loaded after interaction
```

---

## 9. Security Controls

| Concern | Control |
|---------|---------|
| COPPA age gate | Checkbox on all data-capture forms |
| BNPL for minors | Afterpay/Klarna behind "18+" toggle in checkout |
| Payment data | Shopify handles PCI compliance (no card data touches your server) |
| Cookie consent | Shopify built-in GDPR/CCPA banner |
| Admin access | Shopify 2FA on owner account |
| Inventory overselling | Shopify atomic stock decrements prevent race conditions |
| Customer emails | Klaviyo handles unsubscribe compliance (CAN-SPAM / GDPR) |

---

## 10. Key Screens — Mobile Wireframe Summary

| Screen | Primary Action | Key Constraint |
|--------|---------------|----------------|
| Home | Tap drop strip → Drop page | Drop strip only shown when drop is active/upcoming |
| Shop | Filter + browse + add to cart | Filter by type, color, occasion |
| Builder | 5-step customizer | Compatible options only; reset on base change |
| Drop Page | Notify me / Buy now / Waitlist | State-driven: upcoming / live / sold_out |
| Cart | Review + checkout | Apple Pay / Google Pay as hero option for teens |
| Checkout | Complete purchase | BNPL gated behind 18+ confirmation |
| Order Confirm | Track order + share builder CTA | Encourage repeat / referral |

---

_This design feeds directly into Phase 1 build. Start with Shopify setup → theme → builder → drop page._
