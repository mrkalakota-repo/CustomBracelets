'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 30

function VerifyPhoneInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const phone        = searchParams.get('phone') ?? ''
  const { verifyOtp, resendOtp } = useAuth()

  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < OTP_LENGTH) { setError('Enter the 6-digit code.'); return }
    setError(null)
    setLoading(true)
    const { error: err } = await verifyOtp(phone, otp)
    setLoading(false)
    if (err) { setError(err); return }
    router.replace('/profile')
  }

  async function handleResend() {
    setError(null)
    const { error: err } = await resendOtp(phone)
    if (err) { setError(err); return }
    setCooldown(RESEND_COOLDOWN)
  }

  return (
    <main className="page-container py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-text-dark mb-1">Verify your number</h1>
      <p className="text-sm text-text-mid mb-8">
        Enter the 6-digit code sent to <span className="font-medium text-text-dark">{phone}</span>.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">Verification Code</label>
          <input
            className="input w-full tracking-[0.5em] text-center text-lg"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-sm text-sage font-medium disabled:text-text-mid disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </form>
    </main>
  )
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<div className="page-container py-12 text-center text-text-mid">Loading…</div>}>
      <VerifyPhoneInner />
    </Suspense>
  )
}
