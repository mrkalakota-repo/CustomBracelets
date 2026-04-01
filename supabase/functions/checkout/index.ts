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

// ── Rate limiting (in-memory, per-isolate) ────────────────────────────────────

const requestLog = new Map<string, number[]>()

function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now  = Date.now()
  const hits = (requestLog.get(key) ?? []).filter(t => now - t < windowMs)
  if (hits.length >= max) return false
  hits.push(now)
  requestLog.set(key, hits)
  return true
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
  if (!rateLimit(`checkout:${ip}`, 10, 60_000)) {
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
      metadata: { itemCount: String(validItems.length) },
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
