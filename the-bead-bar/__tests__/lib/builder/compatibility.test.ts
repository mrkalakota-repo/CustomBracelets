import { getCompatiblePatterns, isValidCombo, resetFromStep, type BuilderState } from '@/lib/builder/compatibility'

describe('getCompatiblePatterns', () => {
  it('returns only beaded-compatible patterns for beaded base', () => {
    const patterns = getCompatiblePatterns('beaded')
    expect(patterns).toEqual(expect.arrayContaining(['solid', 'two-tone', 'gradient', 'checker', 'stripe']))
    expect(patterns).not.toContain('knotted')
    expect(patterns).not.toContain('braided')
  })

  it('returns only string-compatible patterns for string base', () => {
    const patterns = getCompatiblePatterns('string')
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

  it('accepts string + braided combo', () => {
    expect(isValidCombo('string', 'braided')).toBe(true)
  })

  it('rejects string + twisted combo', () => {
    expect(isValidCombo('string', 'twisted')).toBe(false)
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
