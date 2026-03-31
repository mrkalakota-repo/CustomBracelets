import { calculatePrice, BASE_PRICES, ADDON_PRICES } from '@/lib/builder/pricing'

describe('BASE_PRICES', () => {
  it('defines prices for all bracelet types', () => {
    expect(BASE_PRICES.beaded).toBe(12)
    expect(BASE_PRICES.cord).toBe(10)
    expect(BASE_PRICES.chain).toBe(18)
    expect(BASE_PRICES.charm).toBe(15)
    expect(BASE_PRICES.stackable).toBe(25)
  })
})

describe('calculatePrice', () => {
  it('returns base price with no add-ons', () => {
    expect(calculatePrice('beaded', {})).toBe(12)
    expect(calculatePrice('cord', {})).toBe(10)
    expect(calculatePrice('chain', {})).toBe(18)
  })

  it('adds charm price when charm selected', () => {
    expect(calculatePrice('beaded', { charm: 'star' })).toBe(12 + ADDON_PRICES.charm)
  })

  it('adds text engraving price when text selected', () => {
    expect(calculatePrice('cord', { text: 'BFF' })).toBe(10 + ADDON_PRICES.text)
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
    expect(calculatePrice('cord', {})).toBeGreaterThan(0)
  })
})
