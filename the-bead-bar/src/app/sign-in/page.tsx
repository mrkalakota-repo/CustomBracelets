'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

type Mode = 'signin' | 'signup'

const PIN_LENGTH = 6

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function SignInPage() {
  const router = useRouter()
  const { signInWithPhone, signUpWithPhone } = useAuth()

  const [mode, setMode]                     = useState<Mode>('signin')
  const [phone, setPhone]                   = useState('')
  const [pin, setPin]                       = useState('')
  const [confirmPin, setConfirmPin]         = useState('')
  const [name, setName]                     = useState('')
  const [ageConfirmed, setAgeConfirmed]     = useState(false)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value))
  }

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))
  }

  function handleConfirmPinChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))
  }

  function switchMode(m: Mode) {
    setMode(m)
    setPin('')
    setConfirmPin('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const rawDigits = phone.replace(/\D/g, '')
    if (rawDigits.length < 10) {
      setError('Please enter a valid 10-digit US phone number.')
      return
    }
    if (pin.length < PIN_LENGTH) {
      setError(`Your PIN must be ${PIN_LENGTH} digits.`)
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) { setError('Please enter your name.'); return }
      if (pin !== confirmPin) { setError("PINs don't match."); return }
      if (!ageConfirmed) { setError('Please confirm you are 13 or older.'); return }
    }

    setLoading(true)

    if (mode === 'signin') {
      const { error: err } = await signInWithPhone(phone, pin)
      setLoading(false)
      if (err) { setError(err); return }
      router.back()
    } else {
      const { error: err, needsVerification } = await signUpWithPhone(phone, pin, name.trim())
      setLoading(false)
      if (err) { setError(err); return }
      if (needsVerification) {
        router.push(`/verify-phone?phone=${encodeURIComponent(phone)}`)
      } else {
        router.push('/(tabs)/profile')
      }
    }
  }

  return (
    <main className="page-container py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-text-dark mb-1">
        {mode === 'signin' ? 'Welcome back' : 'Create account'}
      </h1>
      <p className="text-sm text-text-mid mb-8">
        {mode === 'signin'
          ? 'Sign in with your phone number and PIN.'
          : 'Join The Bead Bar for early drop access and saved wishlists.'}
      </p>

      {/* Tab toggle */}
      <div className="flex bg-white rounded-2xl p-1 mb-8 border border-border">
        {(['signin', 'signup'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === m ? 'bg-sage text-white' : 'text-text-mid hover:text-text-dark'
            }`}
          >
            {m === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1.5">Name</label>
            <input
              className="input w-full"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">Phone Number</label>
          <input
            className="input w-full"
            type="tel"
            placeholder="(555) 000-0000"
            value={phone}
            onChange={handlePhoneChange}
            autoComplete="tel"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">
            {mode === 'signin' ? 'PIN' : 'Create PIN (6 digits)'}
          </label>
          <input
            className="input w-full tracking-widest text-center"
            type="password"
            placeholder="••••••"
            value={pin}
            onChange={handlePinChange}
            inputMode="numeric"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            maxLength={PIN_LENGTH}
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1.5">Confirm PIN</label>
            <input
              className={`input w-full tracking-widest text-center ${
                confirmPin.length === PIN_LENGTH && confirmPin !== pin ? 'border-red-300' : ''
              }`}
              type="password"
              placeholder="••••••"
              value={confirmPin}
              onChange={handleConfirmPinChange}
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={PIN_LENGTH}
            />
            {confirmPin.length === PIN_LENGTH && confirmPin !== pin && (
              <p className="text-red-400 text-xs mt-1">PINs don&apos;t match</p>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={e => setAgeConfirmed(e.target.checked)}
              className="w-4 h-4 accent-sage"
            />
            <span className="text-sm text-text-mid">I confirm I am 13 or older</span>
          </label>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
            : (mode === 'signin' ? 'Sign In' : 'Create Account')}
        </button>
      </form>
    </main>
  )
}
