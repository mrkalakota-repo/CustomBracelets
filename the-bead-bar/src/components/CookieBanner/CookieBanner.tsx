'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'chic-charm-cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, [])

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch { /* ignore */ }
    setVisible(false)
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, 'declined') } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-text-mid leading-relaxed">
        We use cookies to keep your cart and preferences. See our{' '}
        <Link href="/privacy-policy" className="underline text-sage hover:text-sage-dark">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={decline}
          className="btn-secondary text-sm px-4 py-2"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="btn-primary text-sm px-4 py-2"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
