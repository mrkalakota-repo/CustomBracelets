// Mock supabase client so pricing.ts can be imported without native deps
jest.mock('../../../src/lib/supabase/client', () => ({
  supabase: { rpc: jest.fn() },
}))

import {
  calculatePriceLocal,
  BASE_PRICES,
  ADDON_PRICES,
} from '../../../src/lib/builder/pricing'

describe('BASE_PRICES', () => {
  it('has correct price for each base style', () => {
    expect(BASE_PRICES.beaded).toBe(12)
    expect(BASE_PRICES.cord).toBe(10)
    expect(BASE_PRICES.chain).toBe(18)
    expect(BASE_PRICES.charm).toBe(15)
    expect(BASE_PRICES.stackable).toBe(25)
  })
})

describe('ADDON_PRICES', () => {
  it('has correct prices for each add-on', () => {
    expect(ADDON_PRICES.charm).toBe(3)
    expect(ADDON_PRICES.text).toBe(4)
    expect(ADDON_PRICES.giftWrap).toBe(2)
    expect(ADDON_PRICES.rush).toBe(5)
  })
})

describe('calculatePriceLocal', () => {
  describe('base price only (no add-ons)', () => {
    it.each([
      ['beaded',    12],
      ['cord',      10],
      ['chain',     18],
      ['charm',     15],
      ['stackable', 25],
    ] as const)('%s returns %d', (base, expected) => {
      expect(calculatePriceLocal(base, {})).toBe(expected)
    })
  })

  describe('add-on pricing', () => {
    it('adds charm price', () => {
      expect(calculatePriceLocal('beaded', { charm: 'star' })).toBe(12 + 3)
    })

    it('adds text price', () => {
      expect(calculatePriceLocal('beaded', { text: 'BFF' })).toBe(12 + 4)
    })

    it('adds gift wrap price', () => {
      expect(calculatePriceLocal('beaded', { giftWrap: true })).toBe(12 + 2)
    })

    it('adds rush price', () => {
      expect(calculatePriceLocal('beaded', { rush: true })).toBe(12 + 5)
    })

    it('stacks multiple add-ons', () => {
      const price = calculatePriceLocal('cord', {
        charm:    'heart',
        text:     'BFF',
        giftWrap: true,
        rush:     true,
      })
      // 10 + 3 + 4 + 2 + 5 = 24
      expect(price).toBe(24)
    })
  })

  describe('BFF duo pricing', () => {
    it('doubles price then subtracts 2 (base only)', () => {
      // beaded: 12 * 2 - 2 = 22
      expect(calculatePriceLocal('beaded', { bffDuo: true })).toBe(22)
    })

    it('applies BFF duo after all add-ons are summed', () => {
      // cord: 10 + 3 (charm) = 13 → 13 * 2 - 2 = 24
      expect(calculatePriceLocal('cord', { charm: 'star', bffDuo: true })).toBe(24)
    })

    it('BFF duo on chain with all add-ons', () => {
      // chain: 18 + 3 + 4 + 2 + 5 = 32 → 32 * 2 - 2 = 62
      expect(calculatePriceLocal('chain', {
        charm:    'moon',
        text:     'Lily',
        giftWrap: true,
        rush:     true,
        bffDuo:   true,
      })).toBe(62)
    })

    it('falsy bffDuo (false) does not apply duo pricing', () => {
      expect(calculatePriceLocal('beaded', { bffDuo: false })).toBe(12)
    })
  })

  describe('falsy add-on values are ignored', () => {
    it('empty string charm is ignored', () => {
      expect(calculatePriceLocal('beaded', { charm: '' })).toBe(12)
    })

    it('undefined add-ons are ignored', () => {
      expect(calculatePriceLocal('beaded', { charm: undefined, text: undefined })).toBe(12)
    })

    it('giftWrap: false is ignored', () => {
      expect(calculatePriceLocal('beaded', { giftWrap: false })).toBe(12)
    })

    it('rush: false is ignored', () => {
      expect(calculatePriceLocal('beaded', { rush: false })).toBe(12)
    })
  })
})
