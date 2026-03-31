'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function OrderConfirmation() {
  const searchParams  = useSearchParams()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    if (redirectStatus === 'succeeded') {
      clearCart()
      setStatus('success')
    } else if (redirectStatus) {
      setStatus('failed')
    }
    // If no redirect_status, someone navigated here directly — show success fallback
    if (!redirectStatus) setStatus('success')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
