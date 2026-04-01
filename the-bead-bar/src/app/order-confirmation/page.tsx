'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import type { CartItem } from '@/lib/cart/cartTypes'

export default function OrderConfirmation() {
  const searchParams  = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    const piId = searchParams.get('payment_intent')

    if (redirectStatus === 'succeeded') {
      clearCart()
      setStatus('success')
      if (piId) fireKlaviyoTracking(piId)
    } else if (redirectStatus) {
      setStatus('failed')
    }
    // If no redirect_status, someone navigated here directly — show success fallback
    if (!redirectStatus) setStatus('success')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fireKlaviyoTracking(piId: string) {
    try {
      // Retrieve stored cart from sessionStorage (saved by CheckoutWrapper)
      let items: CartItem[] = []
      try {
        const stored = sessionStorage.getItem('bead-bar-pending-order')
        if (stored) {
          items = JSON.parse(stored) as CartItem[]
          sessionStorage.removeItem('bead-bar-pending-order')
        }
      } catch {
        // sessionStorage unavailable — proceed without items
      }

      // Fetch order details (email + amount) from Stripe via server-side route
      const detailsRes = await fetch(`/api/checkout-details?pi=${piId}`)
      if (!detailsRes.ok) return
      const { email, amount, orderId } = await detailsRes.json() as {
        email: string | null
        amount: number
        orderId: string
      }

      if (!email) return // Klaviyo requires an email — skip if Stripe didn't capture one

      await fetch('/api/klaviyo/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          orderId,
          total: amount,
          items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        }),
      })
    } catch {
      // Non-fatal — order tracking failure should never break the confirmation page
    }
  }

  if (status === 'loading') {
    return (
      <div className="page-container py-16 text-center text-text-mid">
        Confirming your order…
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="page-container py-16 max-w-lg mx-auto flex flex-col gap-6 text-center">
        <h1 className="text-text-dark">Payment not completed</h1>
        <p className="text-sm text-text-mid">
          Something went wrong. Your card was not charged.
        </p>
        <Link href="/checkout" className="btn-primary">
          Try again
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container py-16 max-w-lg mx-auto flex flex-col gap-6 text-center">
      <div className="text-4xl">✓</div>
      <h1 className="text-text-dark">Order confirmed!</h1>
      <p className="text-sm text-text-mid leading-relaxed">
        Thank you for your order. You&apos;ll receive a confirmation email shortly,
        followed by a shipping notification once your bracelet is on its way.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop" className="btn-secondary">
          Keep shopping
        </Link>
        <Link href="/" className="btn-primary">
          Home
        </Link>
      </div>
    </div>
  )
}
