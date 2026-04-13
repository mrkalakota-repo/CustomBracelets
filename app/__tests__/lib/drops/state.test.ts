import { getDropState } from '../../../src/lib/drops/state'

// Fixed reference point: 2026-04-06T12:00:00Z (today per session)
const NOW = new Date('2026-04-06T12:00:00Z')

// Helpers
const daysFromNow = (days: number) =>
  new Date(NOW.getTime() + days * 24 * 60 * 60 * 1000)

describe('getDropState', () => {
  describe('upcoming', () => {
    it('returns upcoming when launch is in the future', () => {
      expect(getDropState(daysFromNow(1), 20, NOW)).toBe('upcoming')
    })

    it('returns upcoming regardless of stock when future launch', () => {
      expect(getDropState(daysFromNow(5), 0, NOW)).toBe('upcoming')
    })

    it('returns upcoming 1 ms before launch', () => {
      const almostNow = new Date(NOW.getTime() - 1)
      const launchAt  = NOW
      expect(getDropState(launchAt, 20, almostNow)).toBe('upcoming')
    })
  })

  describe('live', () => {
    it('returns live when launched and stock > 0', () => {
      expect(getDropState(daysFromNow(-1), 10, NOW)).toBe('live')
    })

    it('returns live on the exact launch moment', () => {
      expect(getDropState(NOW, 5, NOW)).toBe('live')
    })

    it('returns live 6 days after launch with stock remaining', () => {
      expect(getDropState(daysFromNow(-6), 1, NOW)).toBe('live')
    })
  })

  describe('sold_out', () => {
    it('returns sold_out when stock is 0 within 7 days of launch', () => {
      expect(getDropState(daysFromNow(-3), 0, NOW)).toBe('sold_out')
    })

    it('returns sold_out exactly 7 days after launch with stock 0', () => {
      // boundary: >7 days → ended, exactly 7 days → sold_out
      expect(getDropState(daysFromNow(-7), 0, NOW)).toBe('sold_out')
    })
  })

  describe('ended', () => {
    it('returns ended when stock is 0 and more than 7 days since launch', () => {
      expect(getDropState(daysFromNow(-8), 0, NOW)).toBe('ended')
    })

    it('returns ended for very old drops with no stock', () => {
      expect(getDropState(new Date('2026-01-01T00:00:00Z'), 0, NOW)).toBe('ended')
    })

    it('does NOT return ended if stock > 0 even after 7+ days', () => {
      expect(getDropState(daysFromNow(-30), 1, NOW)).toBe('live')
    })
  })

  describe('accepts ISO string launchDate', () => {
    it('parses string date the same as Date object', () => {
      const launch = daysFromNow(-1)
      const result1 = getDropState(launch, 10, NOW)
      const result2 = getDropState(launch.toISOString(), 10, NOW)
      expect(result1).toBe(result2)
    })
  })

  describe('real drop data', () => {
    it('spring-bloom-2026 is upcoming as of April 6', () => {
      // Launch: 2026-04-15, stock: 100
      expect(getDropState('2026-04-15T12:00:00Z', 100, NOW)).toBe('upcoming')
    })

    it('valentines-2026 is ended (stock 0, launched Feb 10)', () => {
      expect(getDropState('2026-02-10T12:00:00Z', 0, NOW)).toBe('ended')
    })

    it('new-year-2026 is ended (stock 0, launched Jan 1)', () => {
      expect(getDropState('2026-01-01T00:00:00Z', 0, NOW)).toBe('ended')
    })
  })
})
