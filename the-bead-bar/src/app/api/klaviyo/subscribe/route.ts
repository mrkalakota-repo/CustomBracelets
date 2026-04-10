import { NextResponse } from 'next/server'
import { z } from 'zod'
import { subscribeToList } from '@/lib/klaviyo/client'
import { rateLimit } from '@/lib/rateLimit'
import { env } from '@/lib/env'
import { verifyTurnstileToken } from '@/lib/turnstile'

const SubscribeBodySchema = z.object({
  email:          z.string().email('Valid email required'),
  type:           z.enum(['drop', 'waitlist', 'marketing']).default('drop'),
  dropId:         z.string().optional(),
  turnstileToken: z.string().optional(),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!env.KLAVIYO_API_KEY) {
    return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 503 })
  }

  try {
    const body   = await req.json()
    const parsed = SubscribeBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, type, dropId: _dropId, turnstileToken } = parsed.data

    if (turnstileToken) {
      const valid = await verifyTurnstileToken(turnstileToken)
      if (!valid) {
        return NextResponse.json({ error: 'Bot verification failed. Please try again.' }, { status: 403 })
      }
    }

    const listIds: Record<string, string | undefined> = {
      drop:      env.KLAVIYO_DROP_LIST_ID,
      waitlist:  env.KLAVIYO_WAITLIST_LIST_ID,
      marketing: env.KLAVIYO_MARKETING_LIST_ID,
    }
    const listId = listIds[type]
    if (!listId) {
      return NextResponse.json({ error: `List ID for "${type}" is not configured` }, { status: 503 })
    }
    await subscribeToList({ email, listId })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[klaviyo/subscribe]', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
