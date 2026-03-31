'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { BuilderFlow } from './BuilderFlow'
import type { CartItem } from '@/lib/cart/cartTypes'

interface BuilderClientProps {
  isBff?: boolean
}

export function BuilderClient({ isBff }: BuilderClientProps) {
  const { addItem } = useCart()
  const router      = useRouter()

  function handleAddToCart(item: CartItem) {
    addItem(item)
    router.push('/checkout')
  }

  return <BuilderFlow isBff={isBff} onAddToCart={handleAddToCart} />
}
