export interface LineItemProperty {
  name:  string
  value: string
}

export interface BuilderSelection {
  baseStyle:     string
  primaryColor:  string
  accentPattern: string
  addOns: {
    charm?:    string
    text?:     string
    giftWrap?: boolean
    rush?:     boolean
    bffDuo?:   boolean
  }
}

export function buildLineItemProperties(selection: BuilderSelection): LineItemProperty[] {
  if (!selection.baseStyle) {
    throw new Error('Base style is required')
  }

  const props: LineItemProperty[] = [
    { name: 'Base Style',      value: selection.baseStyle },
    { name: 'Primary Color',   value: selection.primaryColor },
    { name: 'Accent Pattern',  value: selection.accentPattern },
  ]

  const { addOns } = selection
  if (addOns.charm)    props.push({ name: 'Charm',       value: addOns.charm })
  if (addOns.text)     props.push({ name: 'Custom Text', value: addOns.text })
  if (addOns.giftWrap) props.push({ name: 'Gift Wrap',   value: 'Yes' })
  if (addOns.rush)     props.push({ name: 'Rush Order',  value: 'Yes' })
  if (addOns.bffDuo)   props.push({ name: 'BFF Set',     value: 'Yes' })

  return props
}

export function validateAgeConfirmation(confirmed: boolean): boolean {
  return confirmed === true
}
