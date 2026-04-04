import Stripe from 'https://esm.sh/stripe@14?target=deno'

// ── Pricing (kept in sync with app/src/lib/builder/pricing.ts) ───────────────

const BASE_PRICES: Record<string, number> = {
  beaded:    12,
  cord:      10,
  chain:     18,
  charm:     15,
  stackable: 25,
}

const ADDON_PRICES = {
  charm:    3,
  text:     4,
  giftWrap: 2,
  rush:     5,
}

interface AddOns {
  charm?:    string
  text?:     string
  giftWrap?: boolean
  rush?:     boolean
  bffDuo?:   boolean
}

function calculatePrice(base: string, addOns: AddOns): number {
  let price = BASE_PRICES[base] ?? 12
  if (addOns.charm)    price += ADDON_PRICES.charm
  if (addOns.text)     price += ADDON_PRICES.text
  if (addOns.giftWrap) price += ADDON_PRICES.giftWrap
  if (addOns.rush)     price += ADDON_PRICES.rush
  if (addOns.bffDuo)   price = price * 2 - 2
  return price
}

function shippingCost(subtotal: number): number {
  return subtotal >= 20 ? 0 : 3.99
}

// ── Validation ────────────────────────────────────────────────────────────────

interface CartItem {
  id:        string
  baseStyle: string
  quantity:  number
  addOns?:   AddOns
}

function validateItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false
  const i = item as Record<string, unknown>
  if (typeof i.id !== 'string') return false
  if (typeof i.baseStyle !== 'string' || !(i.baseStyle in BASE_PRICES)) return false
  if (typeof i.quantity !== 'number' || i.quantity < 1 || i.quantity > 20 || !Number.isInteger(i.quantity)) return false
  return true
}

// ── Rate limiting (distributed via Upstash Redis) ─────────────────────────────
//
// Uses Upstash Redis so the limit is enforced across all Edge Function isolates.
// Requires two Supabase secrets:
//   supabase secrets set UPSTASH_REDIS_URL=https://...
//   supabase secrets set UPSTASH_REDIS_TOKEN=...
//
// If the secrets are absent the limiter degrades gracefully (allows the request)
// and logs a warning — this matches the previous in-memory behaviour on cold
// starts while making the missing-config observable in logs.

const UPSTASH_URL   = Deno.env.get('UPSTASH_REDIS_URL')
const UPSTASH_TOKEN = Deno.env.get('UPSTASH_REDIS_TOKEN')

async function rateLimit(key: string, max: number, windowSec: number): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.warn('[checkout] Upstash not configured — rate limiting disabled')
    return true
  }
  try {
    // INCR + EXPIRE using Upstash REST pipeline for a single round-trip
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(windowSec)],
      ]),
    })
    if (!res.ok) {
      console.warn('[checkout] Upstash pipeline failed, allowing request:', res.status)
      return true
    }
    const [[, count]] = await res.json() as [[string, number], unknown]
    return count <= max
  } catch (err) {
    console.warn('[checkout] Rate-limit check threw, allowing request:', err)
    return true
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!await rateLimit(`checkout:${ip}`, 10, 60)) {
    return json({ error: 'Too many requests' }, 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  if (!body || typeof body !== 'object' || !Array.isArray((body as Record<string, unknown>).items)) {
    return json({ error: 'items array is required' }, 400)
  }

  const items = (body as { items: unknown[] }).items

  if (items.length === 0)  return json({ error: 'Cart is empty' }, 400)
  if (items.length > 20)   return json({ error: 'Too many items' }, 400)

  for (const item of items) {
    if (!validateItem(item)) {
      return json({ error: 'Invalid cart item' }, 400)
    }
  }

  const validItems = items as CartItem[]

  // Recalculate prices server-side — never trust client-supplied prices
  const subtotal = validItems.reduce((sum, item) => {
    return sum + calculatePrice(item.baseStyle, item.addOns ?? {}) * item.quantity
  }, 0)
  const total  = subtotal + shippingCost(subtotal)
  const amount = Math.round(total * 100) // Stripe requires cents

  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
  if (!stripeKey) {
    console.error('[checkout] STRIPE_SECRET_KEY not set')
    return json({ error: 'Payment setup failed' }, 500)
  }

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' })
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        itemCount: String(validItems.length),
        cartItems: JSON.stringify(validItems.map(item => ({
          baseStyle: item.baseStyle,
          quantity:  item.quantity,
          addOns:    item.addOns ?? {},
          price:     calculatePrice(item.baseStyle, item.addOns ?? {}),
        }))),
      },
    })

    return json({ clientSecret: paymentIntent.client_secret }, 200)
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    return json({ error: 'Payment setup failed' }, 500)
  }
})

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
