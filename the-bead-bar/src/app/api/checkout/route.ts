import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { shippingCost } from '@/lib/cart/cartTypes'
import { calculatePrice, BASE_PRICES } from '@/lib/builder/pricing'
import { rateLimit } from '@/lib/rateLimit'
import { env } from '@/lib/env'

const validBaseStyles = Object.keys(BASE_PRICES) as [string, ...string[]]

const CartItemSchema = z.object({
  id:        z.string(),
  baseStyle: z.enum(validBaseStyles),
  quantity:  z.number().int().min(1).max(20),
  addOns: z.object({
    charm:    z.string().optional(),
    text:     z.string().max(40).optional(),
    giftWrap: z.boolean().optional(),
    rush:     z.boolean().optional(),
    bffDuo:   z.boolean().optional(),
  }).optional().default({}),
})

const CheckoutBodySchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Cart is empty').max(20),
})

export async function POST(req: Request) {
const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`checkout:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body   = await req.json()
    const parsed = CheckoutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { items } = parsed.data

    // Recalculate prices server-side — client-supplied price is never trusted
    const subtotal = items.reduce((sum, item) => {
      const serverPrice = calculatePrice(item.baseStyle as keyof typeof BASE_PRICES, item.addOns)
      return sum + serverPrice * item.quantity
    }, 0)
    const total  = subtotal + shippingCost(subtotal)
    const amount = Math.round(total * 100) // Stripe requires cents

    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        itemCount: String(items.length),
        cartItems: JSON.stringify(items.map(item => ({
          baseStyle: item.baseStyle,
          quantity:  item.quantity,
          addOns:    item.addOns ?? {},
          price:     calculatePrice(item.baseStyle as keyof typeof BASE_PRICES, item.addOns ?? {}),
        }))),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
}
