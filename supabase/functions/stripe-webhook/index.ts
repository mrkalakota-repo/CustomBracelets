import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KLAVIYO_API_URL = 'https://a.klaviyo.com/api'

const VALID_BASE_STYLES = new Set(['beaded', 'cord', 'chain', 'charm', 'stackable'])

// ── Env validation ────────────────────────────────────────────────────────────

const stripeSecret      = Deno.env.get('STRIPE_SECRET_KEY')
const webhookSecret     = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const supabaseUrl       = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const klaviyoApiKey     = Deno.env.get('KLAVIYO_API_KEY')

if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
  console.error('[stripe-webhook] Missing required env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
}

const stripe   = new Stripe(stripeSecret ?? '', { apiVersion: '2024-04-10' })
const supabase = createClient(supabaseUrl ?? '', supabaseServiceKey ?? '')

// ── Klaviyo order tracking (best-effort, non-fatal) ───────────────────────────

async function trackKlaviyoOrder(opts: {
  email:   string
  orderId: string
  total:   number
  items:   { baseStyle: string; quantity: number; price: number }[]
}) {
  if (!klaviyoApiKey) return
  try {
    await fetch(`${KLAVIYO_API_URL}/events/`, {
      method:  'POST',
      headers: {
        accept:         'application/json',
        revision:       '2023-12-15',
        'content-type': 'application/json',
        Authorization:  `Klaviyo-API-Key ${klaviyoApiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            unique_id:  opts.orderId, // deduplicates if fired twice
            metric:     { data: { type: 'metric', attributes: { name: 'Placed Order' } } },
            profile:    { data: { type: 'profile', attributes: { email: opts.email } } },
            properties: {
              orderId:   opts.orderId,
              total:     opts.total,
              itemCount: opts.items.reduce((n, i) => n + i.quantity, 0),
              items:     opts.items.map(i => ({ baseStyle: i.baseStyle, quantity: i.quantity, price: i.price })),
            },
            value: opts.total,
          },
        },
      }),
    })
  } catch (err) {
    console.error('[stripe-webhook] Klaviyo tracking failed (non-fatal):', err)
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response('Server misconfiguration', { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[stripe-webhook] Signature verification failed: ${msg}`)
    return new Response(`Webhook Error: ${msg}`, { status: 400 })
  }

  console.log(`[stripe-webhook] Processing event: ${event.type}`)

  // ── charge.refunded — restore inventory ──────────────────────────────────────
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    const piId   = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
    if (!piId) {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Look up the order to get its items
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', piId)
      .maybeSingle()

    if (!order) {
      console.warn(`[stripe-webhook] charge.refunded: no order found for pi ${piId}`)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_config, quantity')
      .eq('order_id', order.id)

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const baseStyle = (item.product_config as any)?.baseStyle
        if (!baseStyle || !VALID_BASE_STYLES.has(baseStyle)) continue
        const { error } = await supabase.rpc('increment_inventory', {
          item_id: `${baseStyle}-base`,
          amount:  item.quantity,
        })
        if (error) console.error(`[stripe-webhook] Failed to restore inventory for ${baseStyle} on refund:`, error)
      }
    }

    // Mark order as refunded
    await supabase
      .from('orders')
      .update({ status: 'refunded' })
      .eq('id', order.id)

    console.log(`[stripe-webhook] Order ${order.id} marked as refunded`)
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi     = event.data.object as Stripe.PaymentIntent
    const userId = pi.metadata.userId ?? null   // null for guest checkout
    const cartItems: unknown[] = (() => {
      try { return JSON.parse(pi.metadata.cartItems || '[]') } catch { return [] }
    })()

    // ── Idempotency: skip if order already created for this payment intent ──
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', pi.id)
      .maybeSingle()

    if (existing) {
      console.log(`[stripe-webhook] Order already exists for ${pi.id}, skipping`)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ── Create Order ──────────────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id:                  userId,
        total_amount:             pi.amount / 100,
        status:                   'paid',
        stripe_payment_intent_id: pi.id,
        shipping_address:         pi.shipping,
      })
      .select()
      .single()

    if (orderError) {
      console.error('[stripe-webhook] Failed to create order:', orderError)
      return new Response(`Order creation failed: ${orderError.message}`, { status: 500 })
    }

    // ── Create Order Items ────────────────────────────────────────────────────
    const validItems = cartItems.filter((item): item is Record<string, unknown> => {
      if (!item || typeof item !== 'object') return false
      const i = item as Record<string, unknown>
      return typeof i.baseStyle === 'string' && VALID_BASE_STYLES.has(i.baseStyle)
    })

    if (validItems.length > 0) {
      const orderItems = validItems.map(item => ({
        order_id: order.id,
        product_config: {
          baseStyle: item.baseStyle,
          addOns:    item.addOns ?? {},
        },
        price:    typeof item.price    === 'number' ? item.price    : 0,
        quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('[stripe-webhook] Failed to create order items:', itemsError)
        // Non-fatal — order record exists, items failed. Log and continue.
      }
    }

    // ── Decrement Inventory ───────────────────────────────────────────────────
    for (const item of validItems) {
      const baseStyle = item.baseStyle as string
      const quantity  = typeof item.quantity === 'number' && Number.isInteger(item.quantity) && item.quantity > 0
        ? item.quantity
        : 1
      const itemId = `${baseStyle}-base`
      try {
        const { data: decremented, error } = await supabase.rpc('decrement_inventory', {
          item_id: itemId,
          amount:  quantity,
        })
        if (error) {
          console.error(`[stripe-webhook] Inventory decrement RPC error for ${itemId}:`, error)
        } else if (!decremented) {
          // Stock was insufficient — payment already captured, flag for manual reconciliation
          console.error(`[stripe-webhook] OVERSELL: insufficient stock for ${itemId} (order ${order.id}, pi ${pi.id}) — manual fulfillment required`)
        }
      } catch (err) {
        console.error(`[stripe-webhook] Inventory RPC threw for ${itemId}:`, err)
      }
    }

    console.log(`[stripe-webhook] Order ${order.id} created successfully`)

    // ── Klaviyo order tracking (best-effort) ──────────────────────────────────
    // pi.receipt_email is null for Apple Pay / Google Pay. Fall back to the
    // charge's billing_details.email (find the succeeded charge).
    const succeededCharge = (pi as any).charges?.data?.find((c: any) => c.status === 'succeeded') ?? null
    const chargeEmail = succeededCharge?.billing_details?.email ?? null
    const rawEmail = pi.receipt_email ?? chargeEmail
    const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
    const email = rawEmail && isValidEmail(rawEmail) ? rawEmail : null
    if (email && validItems.length > 0) {
      await trackKlaviyoOrder({
        email,
        orderId: order.id,
        total:   pi.amount / 100,
        items:   validItems.map(i => ({
          baseStyle: i.baseStyle as string,
          quantity:  typeof i.quantity === 'number' ? i.quantity : 1,
          price:     typeof i.price    === 'number' ? i.price    : 0,
        })),
      })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
