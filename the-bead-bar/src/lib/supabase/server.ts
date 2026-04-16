import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for admin API routes.
 * Bypasses RLS — never expose to the browser.
 * Returns a fresh client per call to avoid shared state across requests.
 */
const noopStorage = {
  getItem:    (_key: string): string | null => null,
  setItem:    (_key: string, _value: string): void => {},
  removeItem: (_key: string): void => {},
}

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    {
      auth: {
        persistSession:     false,
        autoRefreshToken:   false,
        detectSessionInUrl: false,
        storage:            noopStorage,
      },
    }
  )
}
