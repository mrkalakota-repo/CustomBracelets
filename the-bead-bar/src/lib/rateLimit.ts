const store = new Map<string, number[]>()

/**
 * Simple in-memory sliding-window rate limiter.
 * Returns true if the request is allowed, false if the limit is exceeded.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now       = Date.now()
  const hits      = (store.get(key) ?? []).filter(t => now - t < windowMs)
  if (hits.length >= limit) return false
  hits.push(now)
  store.set(key, hits)
  return true
}
