import { create } from 'zustand'
import type { BaseStyle, BuilderState, Pattern } from '../lib/builder/compatibility'
import { resetFromStep } from '../lib/builder/compatibility'
import type { AddOns } from '../lib/builder/pricing'

interface BuilderStore extends Omit<BuilderState, 'addOns'> {
  addOns: AddOns | null
  setBaseStyle:     (base: BaseStyle) => void
  setPrimaryColor:  (color: string) => void
  setAccentPattern: (pattern: Pattern) => void
  setAddOns:        (addOns: AddOns) => void
  resetBuilder:     () => void
  currentStep:      () => number
}

const INITIAL: BuilderState & { addOns: AddOns | null } = {
  baseStyle:     null,
  primaryColor:  null,
  accentPattern: null,
  addOns:        null,
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  ...INITIAL,

  setBaseStyle: (base) => {
    set(state => ({ ...resetFromStep(state as BuilderState, 1), baseStyle: base }))
  },

  setPrimaryColor: (color) => {
    set(state => ({ ...resetFromStep(state as BuilderState, 2), primaryColor: color }))
  },

  setAccentPattern: (pattern) => {
    set(state => ({ ...resetFromStep(state as BuilderState, 3), accentPattern: pattern }))
  },

  setAddOns: (addOns) => set({ addOns }),

  resetBuilder: () => set(INITIAL),

  currentStep: () => {
    const s = get()
    if (!s.baseStyle)     return 1
    if (!s.primaryColor)  return 2
    if (!s.accentPattern && (s.baseStyle !== 'charm')) return 3
    if (!s.addOns)        return 4
    return 5
  },
}))
