import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { env } from '@/lib/env'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const piId = searchParams.get('pi')

  if (!piId || !piId.startsWith('pi_')) {
    return NextResponse.json({ error: 'Invalid payment intent id' }, { status: 400 })
  }

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    const pi = await stripe.paymentIntents.retrieve(piId)

    return NextResponse.json({
      email:     pi.receipt_email ?? null,
      amount:    pi.amount / 100,       // cents → dollars
      orderId:   pi.id,
      status:    pi.status,
    })
  } catch (err) {
    console.error('[checkout-details]', err)
    return NextResponse.json({ error: 'Could not retrieve order details' }, { status: 500 })
  }
}
