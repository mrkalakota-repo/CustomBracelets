'use client'

import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?:  () => void
  onExpire?: () => void
}

/**
 * Renders a Cloudflare Turnstile widget.
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured,
 * so forms work in dev without any Turnstile credentials.
 */
export function TurnstileWidget({ onSuccess, onError, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!siteKey) return null

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{ theme: 'light' }}
    />
  )
}
