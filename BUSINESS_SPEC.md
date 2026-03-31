# Bracelet Business — Full Product & Business Specification
_Generated: 2026-03-29 | Status: Discovery Complete_

---

## 1. Business Overview

| Attribute | Detail |
|-----------|--------|
| **Business Name** | TBD — see naming ideas below |
| **Model** | Direct-to-consumer (D2C), self-made products |
| **Product Type** | Custom + curated bracelets |
| **Price Range** | Budget-friendly: $10–25 |
| **Fulfillment** | Ship from home, ~10 orders/week at launch |
| **Primary Market** | Girls 13–17 (expanding to all genders/ages over time) |
| **Aesthetic** | Minimalist (expanding to other styles over time) |
| **Brand Colors** | Cream + Sage Green |

---

## 2. Business Name Ideas

Pick one or use as inspiration. Ideal: short, memorable, TikTok-friendly.

- **Wristly** — clean, modern, brandable
- **Sagely** — nods to sage green + "wise/cool" vibe
- **Knot & Co.** — craft-forward, friendship energy
- **Beadrop** — combines beads + drops (limited releases)
- **Looply** — fun, youth-friendly, loop = bracelet loop
- **Lumira** — feminine, elegant, minimalist
- **Dainty Drop** — signals both aesthetic and drop culture

---

## 3. Product Catalog

### Bracelet Types (All)
- Beaded
- Cord/String
- Chain
- Charm
- Stackable sets

### Customization System (Middle-ground Builder)
Customers choose from structured options — not full bead-by-bead, but more than just picking a preset:

**Step 1 — Choose Base Style** (e.g., beaded, cord, chain)
**Step 2 — Choose Primary Color** (curated palette per season)
**Step 3 — Choose Accent/Pattern** (3–5 curated combos per base)
**Step 4 — Add Charm or Text** (optional, +$2–3 upsell)
**Step 5 — Preview + Share** (shareable image for social)

### Collection Types
| Type | Cadence | Examples |
|------|---------|---------|
| **Seasonal Collections** | 4x/year | Summer Glow, Fall Earth, Winter Frost, Spring Bloom |
| **Occasion Drops** | As relevant | Valentine's Day, BFFs Day, Back-to-School, Halloween, Graduation |
| **Limited Drops** | Monthly | Small-batch, themed, hype-driven with countdown |
| **Core Catalog** | Always available | Evergreen minimalist styles |

---

## 4. Platform Strategy

### Phase 1 — Mobile-First Website (Launch)
- Standalone website (not Etsy/Amazon)
- Built with Claude Code assistance
- Stack recommendation: **Shopify** (fastest to launch, handles inventory/payments/drops)
- Designed mobile-first: touch targets, thumb-friendly builder, checkout under 3 taps, loads under 2s on 4G
- Key pages: Home, Shop, Builder, Drops, About, Cart/Checkout
- All social traffic (TikTok, Instagram, Pinterest links) lands here — this is always the first user touchpoint

### Phase 2 — Progressive Web App / PWA (Months 2–4)
- Upgrade the website to a PWA — no separate app build required
- Users tap "Add to Home Screen" → brand icon on their phone, feels like a native app
- Push notifications for drops (Android fully supported; iOS supported since iOS 16.4)
- Instant deploys — no App Store review delays, critical for time-sensitive drops
- Single codebase: website + mobile + "app" all in one
- 85% of native app benefits at ~20% of the effort

### Phase 3 — Native App (Months 8+, conditional)
- iOS + Android native app only if metrics justify: 500+ monthly orders and 60%+ repeat purchase rate
- Stack: **React Native** (one codebase for both platforms)
- Adds: deeper OS integration, App Store discoverability, offline mode
- Not before Phase 3 — App Store review delays are a risk for a drop-culture business at early stage

---

## 5. Key Features

### Phase 1 — Must-Have at Launch (Mobile-First Website)
- [ ] Product catalog with filtering (type, color, occasion)
- [ ] Bracelet builder (step-by-step customizer with live preview)
- [ ] Shareable builder output (image card for TikTok/IG stories)
- [ ] Limited drop countdown page (timer + "Notify Me" waitlist)
- [ ] Cart + checkout (Stripe, Apple Pay, Afterpay/Klarna 18+)
- [ ] Order confirmation + tracking
- [ ] Truly mobile-first design (touch targets 44px+, loads under 2s on 4G)

### Phase 2 — PWA Upgrade + Growth Features
- [ ] PWA manifest + service worker (installable, home screen icon)
- [ ] Push notifications for drops (via web push)
- [ ] Wishlist + drop alert signups
- [ ] User profiles + order history
- [ ] UGC gallery (#WristCheck)
- [ ] BFF/duo set builder (build matching sets with a friend)
- [ ] Loyalty points / referral program

### Phase 3 — Native App (conditional on growth metrics)
- [ ] React Native app (iOS + Android)
- [ ] App Store / Play Store listings
- [ ] Deep OS integration (widgets, Siri shortcuts, etc.)
- [ ] Offline browsing mode

---

## 6. Payment Options
- Credit/Debit cards (Stripe)
- Apple Pay / Google Pay
- Buy Now Pay Later: **Afterpay** and/or **Klarna** (critical for teen market)

---

## 7. Viral Growth Strategy

### A. Bracelet Builder Shareability
- After building, generate a stylized image card: "I built this at [BrandName]"
- One-tap share to TikTok, Instagram Stories, Pinterest

### B. Drop Countdown Pages
- Sneaker-culture style hype page per drop
- Countdown timer + sneak peek image + "Notify Me" email/SMS capture
- Sold out badge + waitlist for next restock

### C. UGC Challenge
- Launch hashtag (e.g., #WristCheck or #[BrandName]Stack)
- Feature customer photos on homepage/social
- "Tag us for a chance to be featured + 10% off"

### D. BFF / Duo Sets
- "Build matching sets with your bestie" — separate builder flow
- Market with "send this to your BFF" CTA
- Packaging includes two cards — one per person

### E. Influencer Micro-Strategy (Future)
- Target nano/micro influencers (5K–50K followers) in teen lifestyle, OOTD, aesthetic niches
- Send free PR packages in exchange for unboxing content
- Especially TikTok + Pinterest creators

---

## 8. Brand Voice & Aesthetic

| Attribute | Direction |
|-----------|-----------|
| **Tone** | Friendly, fun, a little playful — not corporate |
| **Colors** | Cream, Sage Green, off-white accents, soft gold |
| **Typography** | Clean sans-serif (e.g., Inter, DM Sans) + one soft script font for headings |
| **Photography** | Flat lays on cream/linen backgrounds, wrist shots in natural light |
| **Packaging** | Minimal, eco-friendly feel — small kraft box or cream envelope + sage tissue |

---

## 9. Launch Roadmap

### Phase 1 — Foundation (Weeks 1–6)
- [ ] Finalize business name + buy domain
- [ ] Build website (home, shop, builder, drop page, checkout)
- [ ] Create core catalog (5–10 SKUs)
- [ ] Set up payments (Stripe + Afterpay)
- [ ] Create social accounts (TikTok, Instagram, Pinterest)
- [ ] Soft launch with first occasion drop

### Phase 2 — PWA + Growth (Months 2–4)
- [ ] Upgrade website to PWA (installable + push notifications)
- [ ] Launch monthly limited drops
- [ ] Start UGC campaign + hashtag
- [ ] Add BFF duo set builder
- [ ] Email/SMS marketing setup (Klaviyo or similar)
- [ ] Begin micro-influencer outreach
- [ ] Loyalty/referral program

### Phase 3 — Native App (Months 8+, conditional)
- [ ] Evaluate: 500+ monthly orders AND 60%+ repeat purchase rate?
- [ ] If yes: Build React Native app (iOS + Android)
- [ ] Expand bracelet styles beyond minimalist
- [ ] App Store + Play Store launch

---

## 10. Open Decisions (Action Items)

| Decision | Status | Notes |
|----------|--------|-------|
| Business name | **Pending** | See Section 2 for ideas |
| Domain purchase | Blocked on name | .com or .shop recommended |
| Tech stack confirmation | **Confirmed** | Next.js + Stripe (full control, lower cost, TDD-friendly) |
| First drop theme | **Pending** | Suggest starting with a Spring/Summer launch |
| PWA upgrade | **Planned** | Phase 2, after website launch |
| Native app | **Conditional** | Phase 3 only if 500+ orders/mo + 60%+ repeat rate |

---

_Next step: Pick a business name, confirm tech stack, and start building Phase 1._

---

## 11. Legal & Compliance

### COPPA (Children's Online Privacy Protection Act)
Applies in the US when collecting data from users under 13.

| Rule | Requirement |
|------|-------------|
| Email/waitlist signup | Add checkbox: "I confirm I am 13 years or older" |
| Account creation | Minimum age: 13. Do not allow under-13 account creation. |
| "Notify Me" forms | Include age confirmation before capturing email/SMS |
| Privacy Policy | Must be published before launch. Must disclose what data is collected and why. |
| Cookies/tracking | Cookie consent banner required (especially for EU visitors) |

**Simplest compliant approach at launch:**
- Add "I am 13 or older" checkbox to all data-capture forms
- Publish a Privacy Policy page (use a generator like Termly or Shopify's built-in)
- Do not run retargeting ads targeted at under-13 audiences

### BNPL Age Restrictions
Afterpay and Klarna both require users to be **18 or older**.

| Solution | Detail |
|----------|--------|
| Default checkout | Show cards, Apple Pay, Google Pay for all users |
| BNPL display | Show Afterpay/Klarna with label: "Available for buyers 18+" |
| Age gate | Optional: "Are you 18 or older?" toggle before showing BNPL options |
| Alternative for teens | Highlight Apple Pay / Google Pay as the fast-checkout option instead |

### Return & Refund Policy
| Order Type | Policy |
|------------|--------|
| Custom/personalized bracelets | Non-refundable (standard industry practice for custom items) |
| Pre-made / curated items | Refund or exchange within 14 days if unworn and in original packaging |
| Damaged on arrival | Full refund or replacement — customer sends photo evidence |
| Wrong item shipped | Full refund or replacement at no cost to customer |
| Lost in transit | Investigate with carrier first; refund or reship if confirmed lost |

> Add a "Returns" page to the website. Keep it simple and friendly in tone.

### Terms of Service
Before launch, publish:
- Terms of Service (covers order disputes, liability limits)
- Privacy Policy (covers data collection)
- Shipping Policy (processing time, carriers, estimated delivery)

Use **Shopify's built-in policy generator** or **Termly.io** for free, legally sound templates.

---

## 12. Admin & Fulfillment Workflow

### Daily Operations (at launch, ~10 orders/week)

**Order Received:**
1. Shopify sends email notification
2. Open order → read custom specs (base style, color, pattern, charm/text)
3. Pull materials and handcraft the bracelet
4. Quality check before packaging

**Packaging:**
1. Wrap bracelet in sage tissue paper
2. Place in kraft box or cream envelope
3. Insert thank-you card (handwritten or printed)
4. For BFF/duo orders: include two separate cards, one per bracelet
5. Attach shipping label (printed via Shopify Shipping or Pirateship)

**Shipping:**
- Carrier: **USPS First Class** (cheapest for small items under 1 oz)
- Label generation: Shopify Shipping (integrated) or Pirateship.com (cheaper rates)
- Processing time to communicate to customers: **3–5 business days** (custom), **1–2 business days** (pre-made)
- Mark order as fulfilled in Shopify → customer receives tracking email automatically

**Drop Launch Day Checklist:**
- [ ] Publish drop product page at scheduled time
- [ ] Activate countdown timer (set to zero / "Live Now")
- [ ] Post on TikTok, Instagram, Pinterest simultaneously
- [ ] Monitor inventory in Shopify — manually mark sold out when stock depleted
- [ ] Send email/SMS to waitlist at drop time (via Klaviyo)

**Weekly Tasks:**
- Restock materials based on upcoming drop theme
- Respond to customer messages within 24 hours
- Post 2–3 pieces of content on social (process videos, new arrivals, UGC reposts)
- Review orders for the week; note what's selling

**Inventory Tracking (Phase 1 — simple):**
Use a Google Sheet or Shopify's built-in inventory:
| Material | Quantity On Hand | Reorder At | Supplier |
|----------|-----------------|------------|----------|
| Sage green cord | X meters | 2 meters | [supplier] |
| Cream beads (4mm) | X units | 50 units | [supplier] |
| Gold charms | X units | 10 units | [supplier] |
| Kraft boxes | X units | 20 units | [supplier] |

> Upgrade to a proper inventory app (e.g., Stocky for Shopify) once orders exceed 30/week.

### Capacity Planning
| Orders/Week | Approach |
|-------------|----------|
| 1–10 | Solo, fully handmade, ship from home |
| 11–30 | Consider pre-making popular combos in small batches |
| 31–60 | Hire part-time help or consider a small workshop space |
| 60+ | Evaluate manufacturer partnership or fulfillment service |

---

## 13. Pricing Table

### Base Pricing

| Bracelet Type | Base Price | COGS Est. | Margin |
|---------------|-----------|-----------|--------|
| Beaded | $12 | $2–3 | ~75–80% |
| Cord/String | $10 | $1–2 | ~80–85% |
| Chain | $18 | $4–6 | ~67–75% |
| Charm | $15 | $3–5 | ~70–80% |
| Stackable Set (3pc) | $25 | $6–8 | ~68–76% |

> COGS = materials only. Does not include packaging (~$0.50–1.00/order) or shipping materials.

### Add-Ons

| Add-On | Price | COGS Est. |
|--------|-------|-----------|
| Custom charm | +$3 | ~$0.50–1 |
| Engraved text (cord/chain) | +$4 | ~$0.50 (labor) |
| Gift wrapping upgrade | +$2 | ~$0.75 |
| BFF/Duo Set (2 matching) | 2× base − $2 discount | 2× COGS |
| Rush processing (1 business day) | +$5 | Labor |

### Shipping

| Method | Customer Price | Your Cost (USPS est.) |
|--------|---------------|----------------------|
| Standard (5–8 days) | Free on orders $20+ / $3.99 under | ~$3.50–4.50 |
| Priority (2–3 days) | $6.99 | ~$7–9 |

> Offer **free shipping over $20** as a conversion incentive — most orders will naturally hit this threshold.

### Break-Even Analysis

| Scenario | Detail |
|----------|--------|
| Avg order value | ~$15–20 |
| Avg COGS + packaging | ~$4–6 |
| Avg gross profit/order | ~$11–14 |
| Monthly fixed costs (Shopify Basic) | ~$39/mo |
| Break-even orders/month | ~3–4 orders covers platform cost |
| 10 orders/week = ~40/month | Est. gross profit: ~$440–560/month at launch |
