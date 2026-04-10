/**
 * @jest-environment node
 */
import { POST } from '@/app/api/checkout/route'
import { orderTotal } from '@/lib/cart/cartTypes'
import type { CartItem } from '@/lib/cart/cartTypes'

// Mock Stripe
const mockPaymentIntentCreate = jest.fn()
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockPaymentIntentCreate,
    },
  }))
})

const CART_ITEMS: CartItem[] = [
  { id: '1', name: 'Sage Beaded', baseStyle: 'beaded', price: 12, quantity: 1, addOns: {}, imageUrl: '' },
  { id: '2', name: 'Cream String', baseStyle: 'string', price: 10, quantity: 2, addOns: {}, imageUrl: '' },
]

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/checkout', () => {
  beforeEach(() => {
    mockPaymentIntentCreate.mockResolvedValue({
      client_secret: 'pi_test_secret_123',
      id: 'pi_test_123',
    })
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
    process.env.KLAVIYO_API_KEY   = 'pk_test_dummy'
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.STRIPE_SECRET_KEY
    delete process.env.KLAVIYO_API_KEY
  })

  it('returns 200 with clientSecret on valid cart', async () => {
    const res = await POST(makeRequest({ items: CART_ITEMS }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.clientSecret).toBe('pi_test_secret_123')
  })

  it('calls Stripe with correct amount in cents', async () => {
    await POST(makeRequest({ items: CART_ITEMS }))
    const total = orderTotal(CART_ITEMS)       // 32 → free shipping → $32.00
    expect(mockPaymentIntentCreate).toHaveBeenCalledWith(
      expect.objectContaining({ amount: Math.round(total * 100) })
    )
  })

  it('calls Stripe with currency usd', async () => {
    await POST(makeRequest({ items: CART_ITEMS }))
    expect(mockPaymentIntentCreate).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'usd' })
    )
  })

  it('enables apple_pay and card payment methods', async () => {
    await POST(makeRequest({ items: CART_ITEMS }))
    expect(mockPaymentIntentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        automatic_payment_methods: { enabled: true },
      })
    )
  })

  it('returns 400 when items array is empty', async () => {
    const res = await POST(makeRequest({ items: [] }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when items field is missing', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Stripe throws', async () => {
    mockPaymentIntentCreate.mockRejectedValue(new Error('Stripe error'))
    const res = await POST(makeRequest({ items: CART_ITEMS }))
    expect(res.status).toBe(500)
  })
})
