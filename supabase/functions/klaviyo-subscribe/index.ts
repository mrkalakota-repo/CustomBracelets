const KLAVIYO_API_URL = 'https://a.klaviyo.com/api'

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
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return json({ error: 'Too many requests' }, 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  if (!body || typeof body !== 'object') return json({ error: 'Invalid request body' }, 400)

  const { email, dropId } = body as Record<string, unknown>

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Valid email required' }, 400)
  }

  const apiKey = Deno.env.get('KLAVIYO_API_KEY')
  const listId = Deno.env.get('KLAVIYO_DROP_LIST_ID')

  if (!apiKey || !listId) {
    console.error('[klaviyo-subscribe] KLAVIYO_API_KEY or KLAVIYO_DROP_LIST_ID not set')
    return json({ error: 'Subscription failed' }, 500)
  }

  const res = await fetch(`${KLAVIYO_API_URL}/profile-subscription-bulk-create-jobs/`, {
    method:  'POST',
    headers: {
      accept:         'application/json',
      revision:       '2023-12-15',
      'content-type': 'application/json',
      Authorization:  `Klaviyo-API-Key ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [{ type: 'profile', attributes: { email } }],
          },
        },
        relationships: {
          list: { data: { type: 'list', id: listId } },
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[klaviyo-subscribe] Klaviyo error:', err)
    return json({ error: 'Subscription failed' }, 500)
  }

  return json({ success: true }, 200)
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
