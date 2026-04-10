'use client'

import Link from 'next/link'
import { DropPage } from './DropPage'
import { getDropState } from '@/lib/drops/state'
import type { Drop } from '@/lib/drops/registry'

interface DropRouteProps {
  drop: Drop | null
}

export function DropRoute({ drop }: DropRouteProps) {
  if (!drop) {
    return (
      <div data-testid="drop-not-found">
        <h1>Drop not found</h1>
        <p>This drop may have ended or the link is incorrect.</p>
        <Link href="/shop">Browse All</Link>
      </div>
    )
  }

  const state  = getDropState(drop.launchDate, drop.stock)
  const dropId = drop.id  // capture before async closures to satisfy TypeScript narrowing

  async function handleNotify(email: string, turnstileToken?: string) {
    const res = await fetch('/api/klaviyo/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, type: 'drop', dropId, turnstileToken }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Subscription failed' }))
      throw new Error(error ?? 'Subscription failed')
    }
  }

  async function handleWaitlist(email: string, turnstileToken?: string) {
    const res = await fetch('/api/klaviyo/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, type: 'waitlist', dropId, turnstileToken }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Subscription failed' }))
      throw new Error(error ?? 'Subscription failed')
    }
  }

  return (
    <DropPage
      drop={{
        id:              drop.id,
        name:            drop.name,
        theme:           drop.theme,
        launchDate:      drop.launchDate,
        previewImageUrl: drop.previewImageUrl,
      }}
      state={state}
      stock={drop.stock}
      onNotifySubmit={handleNotify}
      onWaitlistSubmit={handleWaitlist}
    />
  )
}
