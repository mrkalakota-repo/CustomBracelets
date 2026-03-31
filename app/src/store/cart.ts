import { create } from 'zustand'
import type { Product } from '../lib/products/catalog'
import type { AddOns } from '../lib/builder/pricing'
import { calculatePrice } from '../lib/builder/pricing'
import type { BaseStyle } from '../lib/builder/compatibility'

export interface CartItem {
  id:             string
  product:        Product | null
  baseStyle?:     BaseStyle
  primaryColor?:  string
  accentPattern?: string
  addOns?:        AddOns
  customName?:    string
  price:          number
  quantity:       number
  isCustom:       boolean
}

interface CartStore {
  items:       CartItem[]
  addProduct:  (product: Product) => void
  addCustom:   (config: Omit<CartItem, 'id' | 'product'> & { baseStyle: BaseStyle }) => void
  removeItem:  (id: string) => void
  clearCart:   () => void
  total:       () => number
  itemCount:   () => number
}

function isValidPrice(price: number): boolean {
  return typeof price === 'number' && isFinite(price) && price >= 0
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addProduct: (product) => {
    if (!product?.id || !product?.name) {
      console.warn('[cart] addProduct: invalid product', product)
      return
    }
    if (!isValidPrice(product.price)) {
      console.warn('[cart] addProduct: invalid price', product.price)
      return
    }
    set(state => ({
      items: [
        ...state.items,
        {
          id:       `${product.id}-${Date.now()}`,
          product,
          price:    product.price,
          quantity: 1,
          isCustom: false,
        },
      ],
    }))
  },

  addCustom: (config) => {
    if (!config?.baseStyle) {
      console.warn('[cart] addCustom: missing baseStyle', config)
      return
    }
    const price = calculatePrice(config.baseStyle, config.addOns ?? {})
    if (!isValidPrice(price)) {
      console.warn('[cart] addCustom: calculated price is invalid', price)
      return
    }
    set(state => ({
      items: [
        ...state.items,
        {
          id:       `custom-${Date.now()}`,
          product:  null,
          ...config,
          price,
          quantity: 1,
          isCustom: true,
        },
      ],
    }))
  },

  removeItem: (id) => {
    set(state => ({ items: state.items.filter(i => i.id !== id) }))
  },

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))
