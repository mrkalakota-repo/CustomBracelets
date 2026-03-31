/**
 * @jest-environment node
 */
import { POST as subscribePost } from '@/app/api/klaviyo/subscribe/route'
import { POST as orderPost }     from '@/app/api/klaviyo/order/route'

// Mock the Klaviyo client
const mockSubscribe = jest.fn()
const mockTrackOrder = jest.fn()
jest.mock('@/lib/klaviyo/client', () => ({
  subscribeToList: (...args: unknown[]) => mockSubscribe(...args),
  trackOrder:      (...args: unknown[]) => mockTrackOrder(...args),
}))

function makeRequest(url: string, body: unknown) {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── SUBSCRIBE ROUTE ─────────────────────────────────────────────────────────

describe('POST /api/klaviyo/subscribe', () => {
  beforeEach(() => {
    mockSubscribe.mockResolvedValue(undefined)
    process.env.STRIPE_SECRET_KEY    = 'sk_test_dummy'
    process.env.KLAVIYO_API_KEY      = 'pk_test_dummy'
    process.env.KLAVIYO_DROP_LIST_ID = 'LIST_123'
  })
  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.STRIPE_SECRET_KEY
    delete process.env.KLAVIYO_API_KEY
    delete process.env.KLAVIYO_DROP_LIST_ID
  })

  it('returns 200 on valid subscribe', async () => {
    const res = await subscribePost(makeRequest(
      'http://localhost/api/klaviyo/subscribe',
      { email: 'test@example.com', type: 'drop', dropId: 'spring-bloom-2026' }
    ))
    expect(res.status).toBe(200)
  })

  it('calls subscribeToList with correct email', async () => {
    await subscribePost(makeRequest(
      'http://localhost/api/klaviyo/subscribe',
      { email: 'test@example.com', type: 'drop', dropId: 'spring-bloom-2026' }
    ))
    expect(mockSubscribe).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com' })
    )
  })

  it('returns 400 when email is missing', async () => {
    const res = await subscribePost(makeRequest(
      'http://localhost/api/klaviyo/subscribe',
      { type: 'drop' }
    ))
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is invalid', async () => {
    const res = await subscribePost(makeRequest(
      'http://localhost/api/klaviyo/subscribe',
      { email: 'not-an-email', type: 'drop' }
    ))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Klaviyo throws', async () => {
    mockSubscribe.mockRejectedValue(new Error('Klaviyo error'))
    const res = await subscribePost(makeRequest(
      'http://localhost/api/klaviyo/subscribe',
      { email: 'test@example.com', type: 'drop' }
    ))
    expect(res.status).toBe(500)
  })
})

// ─── ORDER ROUTE ─────────────────────────────────────────────────────────────

describe('POST /api/klaviyo/order', () => {
  const ORDER_PAYLOAD = {
    email:   'buyer@example.com',
    orderId: 'order_abc123',
    total:   32,
    items:   [
      { name: 'Sage Beaded', price: 12, quantity: 1 },
      { name: 'Cream Cord',  price: 10, quantity: 2 },
    ],
  }

  beforeEach(() => mockTrackOrder.mockResolvedValue(undefined))
  afterEach(() => jest.clearAllMocks())

  it('returns 200 on valid order event', async () => {
    const res = await orderPost(makeRequest('http://localhost/api/klaviyo/order', ORDER_PAYLOAD))
    expect(res.status).toBe(200)
  })

  it('calls trackOrder with correct data', async () => {
    await orderPost(makeRequest('http://localhost/api/klaviyo/order', ORDER_PAYLOAD))
    expect(mockTrackOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        email:   'buyer@example.com',
        orderId: 'order_abc123',
        total:   32,
      })
    )
  })

  it('returns 400 when email is missing', async () => {
    const res = await orderPost(makeRequest(
      'http://localhost/api/klaviyo/order',
      { ...ORDER_PAYLOAD, email: undefined }
    ))
    expect(res.status).toBe(400)
  })

  it('returns 400 when orderId is missing', async () => {
    const res = await orderPost(makeRequest(
      'http://localhost/api/klaviyo/order',
      { ...ORDER_PAYLOAD, orderId: undefined }
    ))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Klaviyo throws', async () => {
    mockTrackOrder.mockRejectedValue(new Error('Klaviyo error'))
    const res = await orderPost(makeRequest('http://localhost/api/klaviyo/order', ORDER_PAYLOAD))
    expect(res.status).toBe(500)
  })
})
