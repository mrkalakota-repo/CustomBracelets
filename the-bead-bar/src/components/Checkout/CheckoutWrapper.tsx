'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe/client'
import { useCart } from '@/context/CartContext'
import { CheckoutPage } from './CheckoutPage'
import { StripeCheckoutForm } from './StripeCheckoutForm'

export function CheckoutWrapper() {
  const { items } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [fetchError,   setFetchError]   = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    // Persist cart snapshot so order-confirmation can send Klaviyo tracking
    try {
      sessionStorage.setItem('chic-charm-pending-order', JSON.stringify(items))
    } catch {
      // sessionStorage unavailable (private browsing, etc.) — non-fatal
    }

    fetch('/api/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setFetchError(data.error ?? 'Could not initialize payment.')
      })
      .catch(() => setFetchError('Could not connect to payment service.'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount — items won't change during an active checkout

  if (items.length === 0) {
    return <CheckoutPage items={[]} />
  }

  if (fetchError) {
    return (
      <div className="page-container py-8">
        <p className="text-red-600" data-testid="checkout-error">{fetchError}</p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="page-container py-8 text-center text-text-mid" data-testid="checkout-loading">
        Setting up payment…
      </div>
    )
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <CheckoutPage items={items} paymentSection={<StripeCheckoutForm />} />
    </Elements>
  )
}
