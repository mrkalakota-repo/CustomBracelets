import { buildLineItemProperties, validateAgeConfirmation } from '@/lib/cart/properties'

describe('buildLineItemProperties', () => {
  it('builds correct properties from a full builder selection', () => {
    const selection = {
      baseStyle: 'beaded',
      primaryColor: 'sage-green',
      accentPattern: 'stripe',
      addOns: { charm: 'star', text: 'BFF' },
    }
    const props = buildLineItemProperties(selection)
    expect(props).toContainEqual({ name: 'Base Style', value: 'beaded' })
    expect(props).toContainEqual({ name: 'Primary Color', value: 'sage-green' })
    expect(props).toContainEqual({ name: 'Accent Pattern', value: 'stripe' })
    expect(props).toContainEqual({ name: 'Charm', value: 'star' })
    expect(props).toContainEqual({ name: 'Custom Text', value: 'BFF' })
  })

  it('omits add-on properties when no add-ons selected', () => {
    const selection = {
      baseStyle: 'cord',
      primaryColor: 'cream',
      accentPattern: 'solid',
      addOns: {},
    }
    const props = buildLineItemProperties(selection)
    const keys = props.map(p => p.name)
    expect(keys).not.toContain('Charm')
    expect(keys).not.toContain('Custom Text')
  })

  it('includes BFF set marker when bffDuo is true', () => {
    const selection = {
      baseStyle: 'beaded',
      primaryColor: 'sage-green',
      accentPattern: 'stripe',
      addOns: { bffDuo: true },
    }
    const props = buildLineItemProperties(selection)
    expect(props).toContainEqual({ name: 'BFF Set', value: 'Yes' })
  })

  it('throws when required fields are missing', () => {
    expect(() => buildLineItemProperties({
      baseStyle: '',
      primaryColor: 'sage-green',
      accentPattern: 'stripe',
      addOns: {},
    })).toThrow()
  })
})

describe('validateAgeConfirmation', () => {
  it('returns true when age is confirmed', () => {
    expect(validateAgeConfirmation(true)).toBe(true)
  })

  it('returns false when age is not confirmed', () => {
    expect(validateAgeConfirmation(false)).toBe(false)
  })

  it('returns false when age confirmation is undefined', () => {
    expect(validateAgeConfirmation(undefined as any)).toBe(false)
  })
})
