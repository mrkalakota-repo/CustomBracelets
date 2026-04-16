import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Anon Supabase client for Server Components.
 * Respects RLS — safe for public reads (products, drops).
 * Separate from the browser client.ts to avoid importing browser storage APIs
 * in server contexts.
 */
const noopStorage = {
  getItem:    (_key: string): string | null => null,
  setItem:    (_key: string, _value: string): void => {},
  removeItem: (_key: string): void => {},
}

export function createAnonServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL       ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  ?? '',
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
