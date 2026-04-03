import { supabase } from '../supabase/client'
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

/**
 * Syncs with the centralized Supabase calculate_bracelet_price function.
 * Use this as the single source of truth for final pricing.
 */
export async function calculatePrice(base: BaseStyle, addOns: AddOns): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_bracelet_price', {
    base_style:    base,
    has_charm:     !!addOns.charm,
    has_text:      !!addOns.text,
    has_gift_wrap: !!addOns.giftWrap,
    is_rush:       !!addOns.rush,
    is_bff_duo:    !!addOns.bffDuo,
  })

  if (error) {
    console.error('Error calculating price from server:', error)
    // Fallback to local calculation if server is down (offline support)
    return calculatePriceLocal(base, addOns)
  }

  return data ?? calculatePriceLocal(base, addOns)
}

/**
 * Local fallback for instant UI updates or offline mode.
 */
export function calculatePriceLocal(base: BaseStyle, addOns: AddOns): number {
  let price = BASE_PRICES[base]
  if (addOns.charm)    price += ADDON_PRICES.charm
  if (addOns.text)     price += ADDON_PRICES.text
  if (addOns.giftWrap) price += ADDON_PRICES.giftWrap
  if (addOns.rush)     price += ADDON_PRICES.rush
  if (addOns.bffDuo)   price = price * 2 - 2
  return price
}
