'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { cartTotal, itemCount } from '@/lib/cart/cartTypes'
import type { CartItem } from '@/lib/cart/cartTypes'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM';        payload: CartItem }
  | { type: 'REMOVE_ITEM';     payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE';         payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    case 'HYDRATE':
      return { items: action.payload }
    default:
      return state
  }
}

interface CartContextType {
  items:          CartItem[]
  total:          number
  itemCount:      number
  addItem:        (item: CartItem) => void
  removeItem:     (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart:      () => void
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = 'bead-bar-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) })
    } catch (err) {
      console.warn('[cart] Failed to restore cart from storage — clearing corrupted data:', err)
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch (err) {
      console.warn('[cart] Failed to persist cart to storage:', err)
    }
  }, [state.items])

  const value: CartContextType = {
    items:          state.items,
    total:          cartTotal(state.items),
    itemCount:      itemCount(state.items),
    addItem:        item     => dispatch({ type: 'ADD_ITEM',        payload: item }),
    removeItem:     id       => dispatch({ type: 'REMOVE_ITEM',     payload: id }),
    updateQuantity: (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } }),
    clearCart:      ()       => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
