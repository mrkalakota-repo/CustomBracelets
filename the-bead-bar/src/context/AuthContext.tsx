'use client'

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  session:         Session | null
  user:            User    | null
  loading:         boolean
  signInWithPhone: (phone: string, pin: string) => Promise<{ error: string | null }>
  signUpWithPhone: (phone: string, pin: string, name: string) => Promise<{ error: string | null; needsVerification: boolean }>
  verifyOtp:       (phone: string, token: string) => Promise<{ error: string | null }>
  resendOtp:       (phone: string) => Promise<{ error: string | null }>
  updatePin:       (currentPin: string, newPin: string) => Promise<{ error: string | null }>
  signOut:         () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithPhone(phone: string, pin: string) {
    const e164 = toE164(phone)
    const { error } = await supabase.auth.signInWithPassword({ phone: e164, password: pin })
    return { error: error?.message ?? null }
  }

  async function signUpWithPhone(phone: string, pin: string, name: string) {
    const e164 = toE164(phone)
    const { data, error } = await supabase.auth.signUp({
      phone:    e164,
      password: pin,
      options:  { data: { name } },
    })
    if (error) return { error: error.message, needsVerification: false }
    return { error: null, needsVerification: !data.session }
  }

  async function verifyOtp(phone: string, token: string) {
    const e164 = toE164(phone)
    const { error } = await supabase.auth.verifyOtp({ phone: e164, token, type: 'sms' })
    return { error: error?.message ?? null }
  }

  async function resendOtp(phone: string) {
    const e164 = toE164(phone)
    const { error } = await supabase.auth.resend({ phone: e164, type: 'sms' })
    return { error: error?.message ?? null }
  }

  async function updatePin(currentPin: string, newPin: string) {
    const phone = session?.user?.phone
    if (!phone) return { error: 'Not signed in' }

    // Verify current PIN before allowing the change
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      phone,
      password: currentPin,
    })
    if (verifyError) return { error: 'Current PIN is incorrect' }

    const { error } = await supabase.auth.updateUser({ password: newPin })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session,
      user:    session?.user ?? null,
      loading,
      signInWithPhone,
      signUpWithPhone,
      verifyOtp,
      resendOtp,
      updatePin,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function toE164(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 11) {
    throw new Error('Invalid phone number — must be 10 digits (US)')
  }
  return digits.startsWith('1') ? `+${digits}` : `+1${digits}`
}
