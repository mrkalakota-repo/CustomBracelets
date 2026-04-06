'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">Something went wrong</h2>
      <p className="text-sm text-gray-500">{error.message ?? 'An unexpected error occurred.'}</p>
      <button className="btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
