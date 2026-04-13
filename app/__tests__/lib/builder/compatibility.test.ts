import {
  getCompatiblePatterns,
  isValidCombo,
  resetFromStep,
} from '../../../src/lib/builder/compatibility'
import type { BuilderState } from '../../../src/lib/builder/compatibility'

describe('getCompatiblePatterns', () => {
  it('returns correct patterns for beaded', () => {
    expect(getCompatiblePatterns('beaded')).toEqual(['solid', 'two-tone', 'gradient', 'checker', 'stripe'])
  })

  it('returns correct patterns for cord', () => {
    expect(getCompatiblePatterns('cord')).toEqual(['solid', 'knotted', 'braided', 'dip-dye'])
  })

  it('returns correct patterns for chain', () => {
    expect(getCompatiblePatterns('chain')).toEqual(['plain', 'twisted'])
  })

  it('returns empty array for charm (no patterns)', () => {
    expect(getCompatiblePatterns('charm')).toEqual([])
  })

  it('returns correct patterns for stackable', () => {
    expect(getCompatiblePatterns('stackable')).toEqual([
      'solid', 'two-tone', 'gradient', 'checker', 'stripe', 'knotted', 'braided',
    ])
  })

  it('throws for unknown base style', () => {
    // @ts-expect-error — testing invalid input at runtime
    expect(() => getCompatiblePatterns('unknown')).toThrow('Unknown base style: unknown')
  })
})

describe('isValidCombo', () => {
  it('returns true for valid beaded + solid', () => {
    expect(isValidCombo('beaded', 'solid')).toBe(true)
  })

  it('returns true for valid cord + braided', () => {
    expect(isValidCombo('cord', 'braided')).toBe(true)
  })

  it('returns false when pattern is not compatible with base', () => {
    expect(isValidCombo('chain', 'solid')).toBe(false)
  })

  it('returns false for charm with any pattern', () => {
    expect(isValidCombo('charm', 'solid')).toBe(false)
    expect(isValidCombo('charm', 'knotted')).toBe(false)
  })

  it('returns true for stackable + knotted (borrowed from cord)', () => {
    expect(isValidCombo('stackable', 'knotted')).toBe(true)
  })

  it('returns false for completely unknown pattern', () => {
    expect(isValidCombo('beaded', 'zigzag')).toBe(false)
  })
})

describe('resetFromStep', () => {
  const fullState: BuilderState = {
    baseStyle:     'beaded',
    primaryColor:  'sage',
    accentPattern: 'solid',
    addOns:        { charm: 'star' },
  }

  it('step 1 clears primaryColor, accentPattern, and addOns', () => {
    const result = resetFromStep(fullState, 1)
    expect(result.baseStyle).toBe('beaded')
    expect(result.primaryColor).toBeNull()
    expect(result.accentPattern).toBeNull()
    expect(result.addOns).toBeNull()
  })

  it('step 2 clears accentPattern and addOns but keeps primaryColor', () => {
    const result = resetFromStep(fullState, 2)
    expect(result.primaryColor).toBe('sage')
    expect(result.accentPattern).toBeNull()
    expect(result.addOns).toBeNull()
  })

  it('step 3 clears only addOns', () => {
    const result = resetFromStep(fullState, 3)
    expect(result.primaryColor).toBe('sage')
    expect(result.accentPattern).toBe('solid')
    expect(result.addOns).toBeNull()
  })

  it('step 4+ clears nothing (returns copy of state)', () => {
    const result = resetFromStep(fullState, 4)
    expect(result.primaryColor).toBe('sage')
    expect(result.accentPattern).toBe('solid')
    expect(result.addOns).toEqual({ charm: 'star' })
  })

  it('does not mutate the original state', () => {
    resetFromStep(fullState, 1)
    expect(fullState.primaryColor).toBe('sage')
  })
})
