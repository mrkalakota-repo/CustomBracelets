import type { BaseStyle } from '@/lib/builder/compatibility'

export const BASE_STYLES: { id: BaseStyle; label: string }[] = [
  { id: 'beaded',    label: 'Beaded' },
  { id: 'cord',      label: 'Cord' },
  { id: 'chain',     label: 'Chain' },
  { id: 'charm',     label: 'Charm' },
  { id: 'stackable', label: 'Stackable' },
]

export const SEASONAL_COLORS = [
  { id: 'sage-green',  label: 'Sage Green',  hex: '#8FAF8A' },
  { id: 'cream',       label: 'Cream',       hex: '#F5F0E8' },
  { id: 'dusty-rose',  label: 'Dusty Rose',  hex: '#D4A0A0' },
  { id: 'sky-blue',    label: 'Sky Blue',    hex: '#A0C4D4' },
  { id: 'lavender',    label: 'Lavender',    hex: '#C4A0D4' },
  { id: 'peach',       label: 'Peach',       hex: '#F4C49E' },
  { id: 'soft-gold',   label: 'Soft Gold',   hex: '#C9A96E' },
  { id: 'white',       label: 'Pearl White', hex: '#F8F6F3' },
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
