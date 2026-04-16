import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Admin routes are protected entirely by AdminGuard (client-side).
 * Middleware intentionally does not redirect /admin — cookie-based redirects
 * conflict with the sign-in page's router.back() flow.
 * API security is enforced server-side by verifyAdminAuth() in every admin route.
 *
 * Rate limiting: middleware runs on the Edge runtime where the in-memory
 * rateLimit() helper is unavailable. We use a simple per-IP request counter
 * stored in a module-level Map (reset per isolate restart, sufficient to
 * blunt crawlers and naive brute-force attempts).
 */

const hits = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000  // 1 minute
const MAX_HITS  = 60      // 60 page requests per minute per IP

function pageRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_HITS) return false

  entry.count++
  return true
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (!pageRateLimit(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  const response = NextResponse.next()
  // Belt-and-suspenders: send the noindex header on every admin response in
  // case a bot ignores robots.txt. The layout's <meta> tag covers HTML pages;
  // this header covers any non-HTML responses (redirects, 404s, etc.).
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
