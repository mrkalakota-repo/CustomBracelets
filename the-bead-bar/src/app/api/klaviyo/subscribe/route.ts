import { NextResponse } from 'next/server'
import { z } from 'zod'
import { subscribeToList } from '@/lib/klaviyo/client'
import { rateLimit } from '@/lib/rateLimit'
import { env } from '@/lib/env'

const SubscribeBodySchema = z.object({
  email:  z.string().email('Valid email required'),
  type:   z.enum(['drop', 'waitlist', 'marketing']).default('drop'),
  dropId: z.string().optional(),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body   = await req.json()
    const parsed = SubscribeBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, type, dropId } = parsed.data
    const listIds: Record<string, string> = {
      drop:      env.KLAVIYO_DROP_LIST_ID,
      waitlist:  env.KLAVIYO_WAITLIST_LIST_ID,
      marketing: env.KLAVIYO_MARKETING_LIST_ID,
    }
    const listId = listIds[type]
    await subscribeToList({ email, listId, source: dropId ? `drop:${dropId}` : 'website' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[klaviyo/subscribe]', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
