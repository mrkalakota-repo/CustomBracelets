import { useBuilderStore } from '../../src/store/builder'

function store() {
  return useBuilderStore.getState()
}

beforeEach(() => {
  store().resetBuilder()
})

describe('initial state', () => {
  it('starts with all fields null', () => {
    expect(store().baseStyle).toBeNull()
    expect(store().primaryColor).toBeNull()
    expect(store().accentPattern).toBeNull()
    expect(store().addOns).toBeNull()
  })
})

describe('setBaseStyle', () => {
  it('sets the base style', () => {
    store().setBaseStyle('beaded')
    expect(store().baseStyle).toBe('beaded')
  })

  it('resets primaryColor, accentPattern, and addOns when base changes', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('solid')
    store().setAddOns({ charm: 'star' })

    store().setBaseStyle('cord')

    expect(store().baseStyle).toBe('cord')
    expect(store().primaryColor).toBeNull()
    expect(store().accentPattern).toBeNull()
    expect(store().addOns).toBeNull()
  })
})

describe('setPrimaryColor', () => {
  it('sets the primary color', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('#8FAF8A')
    expect(store().primaryColor).toBe('#8FAF8A')
  })

  it('resets accentPattern and addOns when color changes', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('solid')
    store().setAddOns({ giftWrap: true })

    store().setPrimaryColor('cream')

    expect(store().primaryColor).toBe('cream')
    expect(store().accentPattern).toBeNull()
    expect(store().addOns).toBeNull()
  })

  it('does not reset baseStyle when color changes', () => {
    store().setBaseStyle('cord')
    store().setPrimaryColor('cream')
    store().setPrimaryColor('gold')
    expect(store().baseStyle).toBe('cord')
  })
})

describe('setAccentPattern', () => {
  it('sets the accent pattern', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('checker')
    expect(store().accentPattern).toBe('checker')
  })

  it('resets addOns when pattern changes', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('solid')
    store().setAddOns({ rush: true })

    store().setAccentPattern('stripe')

    expect(store().accentPattern).toBe('stripe')
    expect(store().addOns).toBeNull()
  })

  it('does not reset baseStyle or primaryColor', () => {
    store().setBaseStyle('stackable')
    store().setPrimaryColor('gold')
    store().setAccentPattern('braided')
    store().setAccentPattern('knotted')

    expect(store().baseStyle).toBe('stackable')
    expect(store().primaryColor).toBe('gold')
  })
})

describe('setAddOns', () => {
  it('sets add-ons', () => {
    store().setBaseStyle('cord')
    store().setPrimaryColor('cream')
    store().setAccentPattern('braided')
    store().setAddOns({ charm: 'moon', giftWrap: true })

    expect(store().addOns).toEqual({ charm: 'moon', giftWrap: true })
  })

  it('does not reset any prior steps', () => {
    store().setBaseStyle('chain')
    store().setPrimaryColor('gold')
    store().setAccentPattern('plain')
    store().setAddOns({ bffDuo: true })

    expect(store().baseStyle).toBe('chain')
    expect(store().primaryColor).toBe('gold')
    expect(store().accentPattern).toBe('plain')
  })
})

describe('resetBuilder', () => {
  it('clears all state', () => {
    store().setBaseStyle('charm')
    store().setPrimaryColor('pink')
    store().setAddOns({ rush: true })

    store().resetBuilder()

    expect(store().baseStyle).toBeNull()
    expect(store().primaryColor).toBeNull()
    expect(store().accentPattern).toBeNull()
    expect(store().addOns).toBeNull()
  })
})

describe('currentStep', () => {
  it('returns step 1 when no base selected', () => {
    expect(store().currentStep()).toBe(1)
  })

  it('returns step 2 after base is set', () => {
    store().setBaseStyle('beaded')
    expect(store().currentStep()).toBe(2)
  })

  it('returns step 3 after color is set (non-charm base)', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    expect(store().currentStep()).toBe(3)
  })

  it('returns step 4 after pattern is set', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('solid')
    expect(store().currentStep()).toBe(4)
  })

  it('returns step 5 after all steps complete', () => {
    store().setBaseStyle('beaded')
    store().setPrimaryColor('sage')
    store().setAccentPattern('solid')
    store().setAddOns({})
    expect(store().currentStep()).toBe(5)
  })

  describe('charm base skips step 3 (no pattern)', () => {
    it('returns step 4 after color is set for charm (skips pattern)', () => {
      store().setBaseStyle('charm')
      store().setPrimaryColor('pink')
      // charm has no patterns — currentStep should jump to 4
      expect(store().currentStep()).toBe(4)
    })

    it('returns step 5 after charm + color + addOns', () => {
      store().setBaseStyle('charm')
      store().setPrimaryColor('pink')
      store().setAddOns({ giftWrap: true })
      expect(store().currentStep()).toBe(5)
    })
  })
})
