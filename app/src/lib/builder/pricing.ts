import type { BaseStyle } from './compatibility'

export const BASE_PRICES: Record<BaseStyle, number> = {
  beaded:    12,
  cord:      10,
  chain:     18,
  charm:     15,
  stackable: 25,
}

export const ADDON_PRICES = {
  charm:    3,
  text:     4,
  giftWrap: 2,
  rush:     5,
} as const

export interface AddOns {
  charm?:    string
  text?:     string
  giftWrap?: boolean
  rush?:     boolean
  bffDuo?:   boolean
}

export function calculatePrice(base: BaseStyle, addOns: AddOns): number {
  let price = BASE_PRICES[base]
  if (addOns.charm)    price += ADDON_PRICES.charm
  if (addOns.text)     price += ADDON_PRICES.text
  if (addOns.giftWrap) price += ADDON_PRICES.giftWrap
  if (addOns.rush)     price += ADDON_PRICES.rush
  if (addOns.bffDuo)   price = price * 2 - 2
  return price
}
