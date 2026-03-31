import { getCompatiblePatterns, isValidCombo, resetFromStep, type BuilderState } from '@/lib/builder/compatibility'

describe('getCompatiblePatterns', () => {
  it('returns only beaded-compatible patterns for beaded base', () => {
    const patterns = getCompatiblePatterns('beaded')
    expect(patterns).toEqual(expect.arrayContaining(['solid', 'two-tone', 'gradient', 'checker', 'stripe']))
    expect(patterns).not.toContain('knotted')
    expect(patterns).not.toContain('braided')
  })

  it('returns only cord-compatible patterns for cord base', () => {
    const patterns = getCompatiblePatterns('cord')
    expect(patterns).toEqual(expect.arrayContaining(['solid', 'knotted', 'braided', 'dip-dye']))
    expect(patterns).not.toContain('gradient')
    expect(patterns).not.toContain('checker')
  })

  it('returns only chain-compatible patterns for chain base', () => {
    const patterns = getCompatiblePatterns('chain')
    expect(patterns).toEqual(expect.arrayContaining(['plain', 'twisted']))
    expect(patterns).not.toContain('braided')
    expect(patterns).not.toContain('dip-dye')
  })

  it('returns empty patterns for charm base (charm routes to add-ons)', () => {
    const patterns = getCompatiblePatterns('charm')
    expect(patterns).toHaveLength(0)
  })

  it('throws for unknown base style', () => {
    expect(() => getCompatiblePatterns('unknown-style' as any)).toThrow()
  })
})

describe('isValidCombo', () => {
  it('accepts a valid beaded + stripe combo', () => {
    expect(isValidCombo('beaded', 'stripe')).toBe(true)
  })

  it('rejects beaded + knotted combo', () => {
    expect(isValidCombo('beaded', 'knotted')).toBe(false)
  })

  it('accepts cord + braided combo', () => {
    expect(isValidCombo('cord', 'braided')).toBe(true)
  })

  it('rejects cord + twisted combo', () => {
    expect(isValidCombo('cord', 'twisted')).toBe(false)
  })
})

describe('resetFromStep', () => {
  it('resets step 2, 3, and 4 when step 1 changes', () => {
    const state: BuilderState = {
      baseStyle: 'beaded',
      primaryColor: 'sage-green',
      accentPattern: 'stripe',
      addOns: { charm: 'star' },
    }
    const reset = resetFromStep(state, 1)
    expect(reset.baseStyle).toBe('beaded')
    expect(reset.primaryColor).toBeNull()
    expect(reset.accentPattern).toBeNull()
    expect(reset.addOns).toBeNull()
  })

  it('resets step 3 and 4 when step 2 changes', () => {
    const state: BuilderState = {
      baseStyle: 'beaded',
      primaryColor: 'sage-green',
      accentPattern: 'stripe',
      addOns: { charm: 'star' },
    }
    const reset = resetFromStep(state, 2)
    expect(reset.baseStyle).toBe('beaded')
    expect(reset.primaryColor).toBe('sage-green')
    expect(reset.accentPattern).toBeNull()
    expect(reset.addOns).toBeNull()
  })
})
