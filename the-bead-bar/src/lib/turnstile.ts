const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v1/siteverify'

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns true if valid, or if TURNSTILE_SECRET_KEY is not configured (graceful degradation).
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ secret: secretKey, response: token }),
    })
    const data = await res.json() as { success: boolean }
    return data.success === true
  } catch (err) {
    console.error('[turnstile] verification failed:', err)
    return false
  }
}
