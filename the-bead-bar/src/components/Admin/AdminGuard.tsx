'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE ?? ''

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user || !session) {
      // Use push so router.back() from sign-in returns to /admin
      router.push('/sign-in')
      return
    }

    if (user.phone !== ADMIN_PHONE) {
      router.replace('/')
      return
    }
  }, [user, session, loading, router])

  if (loading) {
    return (
      <div className="page-container py-16 text-center text-text-mid">
        Loading…
      </div>
    )
  }

  if (!user || user.phone !== ADMIN_PHONE) return null

  return <>{children}</>
}
