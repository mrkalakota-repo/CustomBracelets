'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.replace('/sign-in')
  }, [loading, user, router])

  if (loading || !user) {
    return <div className="page-container py-12 text-center text-text-mid">Loading…</div>
  }

  const name  = user.user_metadata?.name as string | undefined
  const phone = user.phone

  async function handleSignOut() {
    await signOut()
    router.replace('/')
  }

  return (
    <main className="page-container py-12 max-w-md mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-dark mb-1">
          {name ? `Hi, ${name}` : 'Your Profile'}
        </h1>
        {phone && <p className="text-sm text-text-mid">{phone}</p>}
      </div>

      <div className="flex flex-col gap-3 border border-border rounded-2xl p-4 bg-white">
        <Link href="/shop" className="text-sm text-text-dark hover:text-sage transition-colors">
          Shop
        </Link>
        <Link href="/builder" className="text-sm text-text-dark hover:text-sage transition-colors">
          Builder
        </Link>
        <hr className="border-border" />
        <Link href="/profile/change-pin" className="text-sm text-text-dark hover:text-sage transition-colors">
          Change PIN
        </Link>
      </div>

      <button
        onClick={handleSignOut}
        className="btn-secondary self-start"
      >
        Sign Out
      </button>
    </main>
  )
}
