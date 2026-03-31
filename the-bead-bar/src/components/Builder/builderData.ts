import type { BaseStyle } from '@/lib/builder/compatibility'

export const BASE_STYLES: { id: BaseStyle; label: string }[] = [
  { id: 'beaded',    label: 'Beaded' },
  { id: 'cord',      label: 'Cord' },
  { id: 'chain',     label: 'Chain' },
  { id: 'charm',     label: 'Charm' },
  { id: 'stackable', label: 'Stackable' },
]

export const SEASONAL_COLORS = [
  { id: 'sage-green',  label: 'Sage Green' },
  { id: 'cream',       label: 'Cream' },
  { id: 'soft-gold',   label: 'Soft Gold' },
  { id: 'dusty-rose',  label: 'Dusty Rose' },
  { id: 'off-white',   label: 'Off White' },
]

export const PATTERNS: Record<BaseStyle, { id: string; label: string }[]> = {
  beaded:    [
    { id: 'solid',    label: 'Solid' },
    { id: 'two-tone', label: 'Two-Tone' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'checker',  label: 'Checker' },
    { id: 'stripe',   label: 'Stripe' },
  ],
  cord:      [
    { id: 'solid',   label: 'Solid' },
    { id: 'knotted', label: 'Knotted' },
    { id: 'braided', label: 'Braided' },
    { id: 'dip-dye', label: 'Dip-Dye' },
  ],
  chain:     [
    { id: 'plain',   label: 'Plain' },
    { id: 'twisted', label: 'Twisted' },
  ],
  charm:     [],
  stackable: [
    { id: 'solid',    label: 'Solid' },
    { id: 'two-tone', label: 'Two-Tone' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'checker',  label: 'Checker' },
    { id: 'stripe',   label: 'Stripe' },
    { id: 'knotted',  label: 'Knotted' },
    { id: 'braided',  label: 'Braided' },
  ],
}

export const CHARMS = [
  { id: 'star',   label: 'Star' },
  { id: 'heart',  label: 'Heart' },
  { id: 'moon',   label: 'Moon' },
  { id: 'flower', label: 'Flower' },
]
