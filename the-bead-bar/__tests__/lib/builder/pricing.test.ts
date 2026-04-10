import { calculatePrice, BASE_PRICES, ADDON_PRICES } from '@/lib/builder/pricing'

describe('BASE_PRICES', () => {
  it('defines prices for all bracelet types', () => {
    expect(BASE_PRICES.beaded).toBe(12)
    expect(BASE_PRICES.string).toBe(10)
    expect(BASE_PRICES.chain).toBe(18)
    expect(BASE_PRICES.stackable).toBe(25)
  })
})

describe('calculatePrice', () => {
  it('returns base price with no add-ons', () => {
    expect(calculatePrice('beaded', {})).toBe(12)
    expect(calculatePrice('string', {})).toBe(10)
    expect(calculatePrice('chain', {})).toBe(18)
  })

  it('adds charm price when charm selected', () => {
    expect(calculatePrice('beaded', { charm: 'star' })).toBe(12 + ADDON_PRICES.charm)
  })

  it('adds text engraving price when text selected', () => {
    expect(calculatePrice('string', { text: 'BFF' })).toBe(10 + ADDON_PRICES.text)
  })

  it('adds gift wrap price when gift wrap selected', () => {
    expect(calculatePrice('chain', { giftWrap: true })).toBe(18 + ADDON_PRICES.giftWrap)
  })

  it('adds rush price when rush selected', () => {
    expect(calculatePrice('beaded', { rush: true })).toBe(12 + ADDON_PRICES.rush)
  })

  it('adds multiple add-ons correctly', () => {
    const expected = 12 + ADDON_PRICES.charm + ADDON_PRICES.giftWrap + ADDON_PRICES.rush
    expect(calculatePrice('beaded', { charm: 'star', giftWrap: true, rush: true })).toBe(expected)
  })

  it('applies BFF duo set discount (2x base minus $2)', () => {
    const single = calculatePrice('beaded', {})
    const duo = calculatePrice('beaded', { bffDuo: true })
    expect(duo).toBe(single * 2 - 2)
  })

  it('never returns a negative price', () => {
    expect(calculatePrice('string', {})).toBeGreaterThan(0)
  })
})

// ─── CROSS-PLATFORM PARITY ────────────────────────────────────────────────────
//
// These tests assert that the canonical pricing values here match those in:
//   - app/src/lib/builder/pricing.ts  (calculatePriceLocal)
//   - supabase/functions/checkout/index.ts (calculatePrice, inlined)
//
// If any of these fail after a price change, update ALL THREE files.

describe('Pricing parity — cross-platform constants', () => {
  // These MUST match BASE_PRICES in app/src/lib/builder/pricing.ts
  // and BASE_PRICES in supabase/functions/checkout/index.ts
  const CROSS_PLATFORM_BASE: Record<string, number> = {
    beaded:    12,
    string:    10,
    chain:     18,
    stackable: 25,
  }

  // These MUST match ADDON_PRICES in app/src/lib/builder/pricing.ts
  // and ADDON_PRICES in supabase/functions/checkout/index.ts
  const CROSS_PLATFORM_ADDONS = { charm: 3, text: 4, giftWrap: 2, rush: 5 }

  it('BASE_PRICES match cross-platform expected values', () => {
    expect(BASE_PRICES).toEqual(CROSS_PLATFORM_BASE)
  })

  it('ADDON_PRICES match cross-platform expected values', () => {
    expect(ADDON_PRICES).toEqual(CROSS_PLATFORM_ADDONS)
  })

  it('BFF duo formula is price*2-2 across all base styles', () => {
    for (const [style, base] of Object.entries(CROSS_PLATFORM_BASE)) {
      const expected = base * 2 - 2
      expect(calculatePrice(style as any, { bffDuo: true })).toBe(expected)
    }
  })

  it('all add-ons stack correctly — matches native calculatePriceLocal logic', () => {
    const allAddOns = { charm: 'star', text: 'BFF', giftWrap: true as const, rush: true as const }
    const expected  = 12 + 3 + 4 + 2 + 5 // beaded + charm + text + giftWrap + rush
    expect(calculatePrice('beaded', allAddOns)).toBe(expected)
  })

  it('shipping is free at $20 and above — matches native and edge function', () => {
    const { shippingCost } = require('@/lib/cart/cartTypes')
    expect(shippingCost(20)).toBe(0)
    expect(shippingCost(19.99)).toBe(3.99)
    expect(shippingCost(0)).toBe(3.99)
  })
})
