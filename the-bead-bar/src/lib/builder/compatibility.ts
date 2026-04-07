export type BaseStyle = 'beaded' | 'string' | 'chain' | 'stackable'
export type Pattern = string

const COMPATIBLE_PATTERNS: Record<BaseStyle, Pattern[]> = {
  beaded:    ['solid', 'two-tone', 'gradient', 'checker', 'stripe'],
  string:    ['solid', 'knotted', 'braided', 'dip-dye'],
  chain:     ['plain', 'twisted'],
  stackable: ['solid', 'two-tone', 'gradient', 'checker', 'stripe', 'knotted', 'braided'],
}

export function getCompatiblePatterns(base: BaseStyle): Pattern[] {
  if (!(base in COMPATIBLE_PATTERNS)) {
    throw new Error(`Unknown base style: ${base}`)
  }
  return COMPATIBLE_PATTERNS[base]
}

export function isValidCombo(base: BaseStyle, pattern: Pattern): boolean {
  return getCompatiblePatterns(base).includes(pattern)
}

export interface BuilderState {
  baseStyle: BaseStyle | null
  primaryColor: string | null
  accentPattern: Pattern | null
  addOns: Record<string, unknown> | null
}

export function resetFromStep(state: BuilderState, fromStep: number): BuilderState {
  const next = { ...state }
  if (fromStep <= 1) next.primaryColor = null
  if (fromStep <= 2) next.accentPattern = null
  if (fromStep <= 3) next.addOns = null
  return next
}
