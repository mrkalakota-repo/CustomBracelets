const KLAVIYO_API_URL = 'https://a.klaviyo.com/api'

interface SubscribePayload {
  email:   string
  listId:  string
  source?: string
}

interface OrderPayload {
  email:      string
  orderId:    string
  total:      number
  itemCount:  number
  items:      { name: string; price: number; quantity: number }[]
}

export async function subscribeToList({ email, listId, source }: SubscribePayload): Promise<void> {
  const apiKey = process.env.KLAVIYO_PRIVATE_KEY
  if (!apiKey) throw new Error('KLAVIYO_PRIVATE_KEY is not set')

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
            data: [{ type: 'profile', attributes: { email, source: source ?? 'website' } }],
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
    throw new Error(`Klaviyo subscribe failed: ${err}`)
  }
}

export async function trackOrder({ email, orderId, total, itemCount, items }: OrderPayload): Promise<void> {
  const apiKey = process.env.KLAVIYO_PRIVATE_KEY
  if (!apiKey) throw new Error('KLAVIYO_PRIVATE_KEY is not set')

  const res = await fetch(`${KLAVIYO_API_URL}/events/`, {
    method:  'POST',
    headers: {
      accept:         'application/json',
      revision:       '2023-12-15',
      'content-type': 'application/json',
      Authorization:  `Klaviyo-API-Key ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          metric:     { data: { type: 'metric', attributes: { name: 'Placed Order' } } },
          profile:    { data: { type: 'profile', attributes: { email } } },
          properties: { orderId, total, itemCount, items },
          value:      total,
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Klaviyo track order failed: ${err}`)
  }
}
