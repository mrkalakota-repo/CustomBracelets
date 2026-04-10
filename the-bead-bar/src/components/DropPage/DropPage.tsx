'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DropState } from '@/lib/drops/state'
import { AgeGateForm } from '@/components/AgeGateForm/AgeGateForm'
import { TurnstileWidget } from '@/components/Turnstile/TurnstileWidget'

interface Drop {
  id:              string
  name:            string
  theme:           string
  launchDate:      Date
  previewImageUrl: string
}

interface DropPageProps {
  drop:               Drop
  state:              DropState
  stock:              number
  onNotifySubmit?:    (email: string, turnstileToken?: string) => Promise<void> | void
  onWaitlistSubmit?:  (email: string, turnstileToken?: string) => Promise<void> | void
}

export function DropPage({ drop, state, stock, onNotifySubmit, onWaitlistSubmit }: DropPageProps) {
  return (
    <div className="drop-page page-container py-8 flex flex-col gap-6">
      <div className="text-center">
        <h1>{drop.name}</h1>
        <p className="text-text-mid mt-1">{drop.theme}</p>
      </div>

      {state === DropState.UPCOMING && (
        <UpcomingView
          drop={drop}
          onNotifySubmit={onNotifySubmit}
        />
      )}

      {state === DropState.LIVE && (
        <LiveView stock={stock} />
      )}

      {state === DropState.SOLD_OUT && (
        <SoldOutView onWaitlistSubmit={onWaitlistSubmit} />
      )}

      {state === DropState.ENDED && (
        <EndedView dropName={drop.name} />
      )}
    </div>
  )
}

// ─── UPCOMING ────────────────────────────────────────────────────────────────

function UpcomingView({
  drop,
  onNotifySubmit,
}: {
  drop: Drop
  onNotifySubmit?: (email: string) => void
}) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <CountdownTimer launchDate={drop.launchDate} />
      <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden">
        <Image
          data-testid="sneak-peek-image"
          src={drop.previewImageUrl}
          alt={`${drop.name} sneak peek`}
          fill
          sizes="(min-width: 640px) 384px, 100vw"
          className="object-cover"
        />
      </div>
      <NotifyMeForm onSubmit={onNotifySubmit} />
    </div>
  )
}

function CountdownTimer({ launchDate }: { launchDate: Date }) {
  const diff = launchDate.getTime() - Date.now()
  const totalSeconds = Math.max(0, Math.floor(diff / 1000))
  const days    = Math.floor(totalSeconds / 86400)
  const hours   = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div data-testid="countdown-timer" className="flex gap-3 text-center">
      {[{ v: days, l: 'd' }, { v: hours, l: 'h' }, { v: minutes, l: 'm' }, { v: seconds, l: 's' }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center">
          <span className="text-3xl font-semibold tabular-nums">{v}</span>
          <span className="text-xs text-text-light uppercase tracking-widest">{l}</span>
        </div>
      ))}
    </div>
  )
}

function NotifyMeForm({ onSubmit }: { onSubmit?: (email: string, turnstileToken?: string) => Promise<void> | void }) {
  const [email,            setEmail]            = useState('')
  const [ageConfirmed,     setAgeConfirmed]     = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [submitted,        setSubmitted]        = useState(false)
  const [error,            setError]            = useState<string | null>(null)
  const [turnstileToken,   setTurnstileToken]   = useState<string | null>(null)

  const needsTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const canSubmit = email.trim().length > 0 && ageConfirmed && marketingConsent &&
    (!needsTurnstile || !!turnstileToken)

  async function handleSubmit() {
    if (!canSubmit) return
    setError(null)
    try {
      await onSubmit?.(email.trim(), turnstileToken ?? undefined)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return <p data-testid="notify-success" className="text-sage font-medium text-center">You&apos;re on the list! We&apos;ll notify you when the drop goes live.</p>
  }

  return (
    <form data-testid="notify-me-form" className="w-full max-w-sm flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
      <label className="flex flex-col gap-1 text-sm font-medium text-text-mid">
        Email
        <input
          type="email"
          aria-label="Email"
          value={email}
          className="input"
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <AgeGateForm checked={ageConfirmed} onChange={setAgeConfirmed} />
      <label className="flex items-start gap-2 text-xs text-text-mid cursor-pointer">
        <input
          type="checkbox"
          data-testid="marketing-consent"
          checked={marketingConsent}
          onChange={e => setMarketingConsent(e.target.checked)}
          className="mt-0.5 accent-[var(--sage)]"
        />
        I agree to receive marketing emails from Chic Charm Co.. You can unsubscribe at any time.
      </label>
      <TurnstileWidget
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />
      {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        className="btn-primary"
        disabled={!canSubmit}
      >
        Notify Me
      </button>
    </form>
  )
}

// ─── LIVE ─────────────────────────────────────────────────────────────────────

function LiveView({ stock }: { stock: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span data-testid="live-badge" className="badge-live">Live Now</span>
      <p data-testid="stock-count" className="text-sm text-text-mid">{stock} remaining</p>
      {stock <= 3 && (
        <p data-testid="urgency-message" className="text-sm font-semibold text-gold">Only {stock} left!</p>
      )}
    </div>
  )
}

// ─── SOLD OUT ─────────────────────────────────────────────────────────────────

function SoldOutView({ onWaitlistSubmit }: { onWaitlistSubmit?: (email: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <span data-testid="sold-out-badge" className="badge-sold-out">Sold Out</span>
      <WaitlistForm onSubmit={onWaitlistSubmit} />
    </div>
  )
}

function WaitlistForm({ onSubmit }: { onSubmit?: (email: string, turnstileToken?: string) => Promise<void> | void }) {
  const [email,            setEmail]            = useState('')
  const [ageConfirmed,     setAgeConfirmed]     = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [submitted,        setSubmitted]        = useState(false)
  const [error,            setError]            = useState<string | null>(null)
  const [turnstileToken,   setTurnstileToken]   = useState<string | null>(null)

  const needsTurnstile = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const canSubmit = email.trim().length > 0 && ageConfirmed && marketingConsent &&
    (!needsTurnstile || !!turnstileToken)

  async function handleSubmit() {
    if (!canSubmit) return
    setError(null)
    try {
      await onSubmit?.(email.trim(), turnstileToken ?? undefined)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return <p data-testid="waitlist-success" className="text-sage font-medium text-center">You&apos;re on the waitlist! We&apos;ll let you know when stock is back.</p>
  }

  return (
    <form data-testid="waitlist-form" className="w-full max-w-sm flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
      <label className="flex flex-col gap-1 text-sm font-medium text-text-mid">
        Email
        <input
          type="email"
          aria-label="Email"
          value={email}
          className="input"
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <AgeGateForm checked={ageConfirmed} onChange={setAgeConfirmed} />
      <label className="flex items-start gap-2 text-xs text-text-mid cursor-pointer">
        <input
          type="checkbox"
          data-testid="marketing-consent"
          checked={marketingConsent}
          onChange={e => setMarketingConsent(e.target.checked)}
          className="mt-0.5 accent-[var(--sage)]"
        />
        I agree to receive marketing emails from Chic Charm Co.. You can unsubscribe at any time.
      </label>
      <TurnstileWidget
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />
      {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        className="btn-primary"
        disabled={!canSubmit}
      >
        Join Waitlist
      </button>
    </form>
  )
}

// ─── ENDED ────────────────────────────────────────────────────────────────────

function EndedView({ dropName }: { dropName: string }) {
  return (
    <div data-testid="ended-message" className="text-center py-8">
      <p className="text-text-mid">The {dropName} drop has ended. Check back for upcoming drops!</p>
    </div>
  )
}
