'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const PIN_LENGTH = 6

export default function ChangePinPage() {
  const router = useRouter()
  const { user, loading, updatePin } = useAuth()

  const [currentPin, setCurrentPin] = useState('')
  const [newPin,     setNewPin]     = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [success,    setSuccess]    = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/sign-in')
  }, [loading, user, router])

  if (loading || !user) {
    return <div className="page-container py-12 text-center text-text-mid">Loading…</div>
  }

  function handlePinInput(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (currentPin.length < PIN_LENGTH) {
      setError(`Current PIN must be ${PIN_LENGTH} digits.`)
      return
    }
    if (newPin.length < PIN_LENGTH) {
      setError(`New PIN must be ${PIN_LENGTH} digits.`)
      return
    }
    if (newPin !== confirmPin) {
      setError("New PINs don't match.")
      return
    }
    if (newPin === currentPin) {
      setError('New PIN must be different from your current PIN.')
      return
    }

    setSubmitting(true)
    const { error: err } = await updatePin(currentPin, newPin)
    setSubmitting(false)

    if (err) {
      setError(err)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <main className="page-container py-12 max-w-md mx-auto flex flex-col gap-6">
        <div className="rounded-2xl bg-sage-light border border-sage p-6 text-center flex flex-col items-center gap-3">
          <p className="text-2xl">&#10003;</p>
          <p className="font-semibold text-text-dark">PIN updated successfully</p>
          <p className="text-sm text-text-mid">Use your new PIN next time you sign in.</p>
        </div>
        <button onClick={() => router.push('/profile')} className="btn-primary self-start">
          Back to profile
        </button>
      </main>
    )
  }

  return (
    <main className="page-container py-12 max-w-md mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-text-mid hover:text-text-dark transition-colors mb-6 block"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold text-text-dark mb-1">Change PIN</h1>
      <p className="text-sm text-text-mid mb-8">Your PIN is the 6-digit code you use to sign in.</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">Current PIN</label>
          <input
            className="input w-full tracking-widest text-center"
            type="password"
            inputMode="numeric"
            placeholder="••••••"
            maxLength={PIN_LENGTH}
            value={currentPin}
            onChange={handlePinInput(setCurrentPin)}
            autoComplete="current-password"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">New PIN</label>
          <input
            className="input w-full tracking-widest text-center"
            type="password"
            inputMode="numeric"
            placeholder="••••••"
            maxLength={PIN_LENGTH}
            value={newPin}
            onChange={handlePinInput(setNewPin)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-mid mb-1.5">Confirm new PIN</label>
          <input
            className={`input w-full tracking-widest text-center ${
              confirmPin.length === PIN_LENGTH && confirmPin !== newPin ? 'border-red-300' : ''
            }`}
            type="password"
            inputMode="numeric"
            placeholder="••••••"
            maxLength={PIN_LENGTH}
            value={confirmPin}
            onChange={handlePinInput(setConfirmPin)}
            autoComplete="new-password"
          />
          {confirmPin.length === PIN_LENGTH && confirmPin !== newPin && (
            <p className="text-red-400 text-xs mt-1">PINs don&apos;t match</p>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Updating…' : 'Update PIN'}
        </button>
      </form>
    </main>
  )
}
