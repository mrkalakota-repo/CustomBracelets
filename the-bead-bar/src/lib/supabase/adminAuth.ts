import 'server-only'
import { createServerSupabaseClient } from './server'
import { env } from '@/lib/env'

interface AdminAuthResult {
  authorized: boolean
  error?:     string
  status?:    number
}

/**
 * Verifies that the request comes from the admin user.
 * Extracts the Bearer token, validates it with Supabase Auth,
 * and checks that the user's phone matches ADMIN_PHONE.
 * Used by every admin API route handler.
 */
export async function verifyAdminAuth(request: Request): Promise<AdminAuthResult> {
  const authHeader = request.headers.get('Authorization') ?? ''
  const token      = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return { authorized: false, error: 'Unauthorized', status: 401 }
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY && !env.ADMIN_PHONE) {
    return { authorized: false, error: 'Admin not configured: SUPABASE_SERVICE_ROLE_KEY and ADMIN_PHONE are missing', status: 503 }
  }
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    return { authorized: false, error: 'Admin not configured: SUPABASE_SERVICE_ROLE_KEY is missing', status: 503 }
  }
  if (!env.ADMIN_PHONE) {
    return { authorized: false, error: 'Admin not configured: ADMIN_PHONE is missing', status: 503 }
  }

  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return { authorized: false, error: 'Unauthorized', status: 401 }
  }

  if (user.phone !== env.ADMIN_PHONE) {
    return { authorized: false, error: 'Forbidden', status: 403 }
  }

  return { authorized: true }
}
