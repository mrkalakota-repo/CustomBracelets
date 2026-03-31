import { NextResponse } from 'next/server'
import { z } from 'zod'
import { trackOrder } from '@/lib/klaviyo/client'
import { rateLimit } from '@/lib/rateLimit'
const OrderBodySchema = z.object({
  email:   z.string().email('Valid email required'),
  orderId: z.string().min(1, 'orderId required'),
  total:   z.number().min(0).optional().default(0),
  items:   z.array(z.object({
    name:     z.string(),
    price:    z.number(),
    quantity: z.number().int().min(1),
  })).optional().default([]),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`order:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body   = await req.json()
    const parsed = OrderBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, orderId, total, items } = parsed.data
    await trackOrder({ email, orderId, total, itemCount: items.length, items })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[klaviyo/order]', err)
    return NextResponse.json({ error: 'Order tracking failed' }, { status: 500 })
  }
}
