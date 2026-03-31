'use client'

import { useState } from 'react'
import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js'

export function StripeCheckoutForm() {
  const stripe   = useStripe()
  const elements = useElements()
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const returnUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/order-confirmation`
    : '/order-confirmation'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })

    // confirmPayment only returns here on error — success redirects the page
    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  async function handleExpressConfirm(event: StripeExpressCheckoutElementConfirmEvent) {
    if (!stripe || !elements) return

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    })

    if (stripeError) {
      event.paymentFailed({ reason: 'fail' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div data-testid="express-checkout" className="flex flex-col gap-2">
        <p className="text-xs text-text-light uppercase tracking-wider font-medium">Fast checkout</p>
        <ExpressCheckoutElement onConfirm={handleExpressConfirm} />
      </div>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="text-xs text-text-light">or pay by card</span>
        <hr className="flex-1 border-border" />
      </div>

      <PaymentElement />

      {error && (
        <p data-testid="payment-error" className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!stripe || loading}
        data-testid="pay-now-btn"
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  )
}
