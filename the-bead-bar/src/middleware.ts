import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Admin routes are protected entirely by AdminGuard (client-side).
 * Middleware intentionally does not redirect /admin — cookie-based redirects
 * conflict with the sign-in page's router.back() flow.
 * API security is enforced server-side by verifyAdminAuth() in every admin route.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
