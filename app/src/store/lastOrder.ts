import { create } from 'zustand'
import type { CartItem } from './cart'

interface LastOrderStore {
  items:    CartItem[]
  total:    number
  setOrder: (items: CartItem[], total: number) => void
  clear:    () => void
}

// Non-persistent — intentionally in-memory only. Survives navigation but not
// app restarts, which is fine: it's only needed on the order-confirmation screen.
export const useLastOrderStore = create<LastOrderStore>((set) => ({
  items:    [],
  total:    0,
  setOrder: (items, total) => set({ items, total }),
  clear:    () => set({ items: [], total: 0 }),
}))
