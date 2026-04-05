import { render, screen } from '@testing-library/react'
import { CheckoutPage } from '@/components/Checkout/CheckoutPage'
import type { CartItem } from '@/lib/cart/cartTypes'

const CART_ITEMS: CartItem[] = [
  {
    id: '1', name: 'Sage Beaded', baseStyle: 'beaded',
    price: 12, quantity: 1, addOns: {}, imageUrl: '/img/1.jpg',
  },
  {
    id: '2', name: 'Cream Cord', baseStyle: 'cord',
    price: 10, quantity: 2, addOns: { giftWrap: true }, imageUrl: '/img/2.jpg',
  },
]

const EMPTY_CART: CartItem[] = []

// ─── CART SUMMARY ─────────────────────────────────────────────────────────────

describe('CheckoutPage — Cart Summary', () => {
  it('renders the checkout page', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('checkout-page')).toBeInTheDocument()
  })

  it('renders all cart items', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getAllByTestId('cart-item')).toHaveLength(2)
  })

  it('renders each item name', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByText('Sage Beaded')).toBeInTheDocument()
    expect(screen.getByText('Cream Cord')).toBeInTheDocument()
  })

  it('renders each item price', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByText('$12.00')).toBeInTheDocument()
  })

  it('renders item quantity', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('item-qty-2')).toHaveTextContent('2')
  })

  it('renders add-on labels on item', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByText(/gift wrap/i)).toBeInTheDocument()
  })

  it('shows empty cart message when cart is empty', () => {
    render(<CheckoutPage items={EMPTY_CART} />)
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
  })

  it('does not render checkout form when cart is empty', () => {
    render(<CheckoutPage items={EMPTY_CART} />)
    expect(screen.queryByTestId('checkout-form')).not.toBeInTheDocument()
  })
})

// ─── ORDER TOTALS ─────────────────────────────────────────────────────────────

describe('CheckoutPage — Order Totals', () => {
  it('renders the subtotal correctly', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    // 12 + (10 * 2) = $32.00
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$32.00')
  })

  it('renders free shipping when subtotal >= $20', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('shipping')).toHaveTextContent(/free/i)
  })

  it('renders $3.99 shipping when subtotal < $20', () => {
    const cheapCart: CartItem[] = [{
      id: '1', name: 'Cord', baseStyle: 'cord',
      price: 10, quantity: 1, addOns: {}, imageUrl: '',
    }]
    render(<CheckoutPage items={cheapCart} />)
    expect(screen.getByTestId('shipping')).toHaveTextContent('$3.99')
  })

  it('renders the order total', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('order-total')).toHaveTextContent('$32.00')
  })

  it('renders free shipping promo message when under threshold', () => {
    const cheapCart: CartItem[] = [{
      id: '1', name: 'Cord', baseStyle: 'cord',
      price: 10, quantity: 1, addOns: {}, imageUrl: '',
    }]
    render(<CheckoutPage items={cheapCart} />)
    expect(screen.getByTestId('free-shipping-nudge')).toBeInTheDocument()
    expect(screen.getByTestId('free-shipping-nudge')).toHaveTextContent(/\$10/)
  })
})

// ─── PAYMENT OPTIONS ──────────────────────────────────────────────────────────

describe('CheckoutPage — Payment Options', () => {
  it('renders the checkout form', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('checkout-form')).toBeInTheDocument()
  })

  it('renders a Pay Now button', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByRole('button', { name: /pay now/i })).toBeInTheDocument()
  })

  it('renders Apple Pay / Google Pay fast checkout section', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.getByTestId('express-checkout')).toBeInTheDocument()
  })

  it('does not render BNPL section (removed pending provider integration)', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    expect(screen.queryByTestId('bnpl-section')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /afterpay/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /klarna/i })).not.toBeInTheDocument()
  })

  it('renders an Edit cart link back to /cart', () => {
    render(<CheckoutPage items={CART_ITEMS} />)
    const link = screen.getByRole('link', { name: /edit cart/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/cart')
  })
})

// ─── CART TOTALS UNIT TESTS ───────────────────────────────────────────────────

describe('cartTotal / orderTotal helpers', () => {
  it('calculates cart subtotal correctly', async () => {
    const { cartTotal } = await import('@/lib/cart/cartTypes')
    expect(cartTotal(CART_ITEMS)).toBe(32) // 12 + 10*2
  })

  it('returns 0 for empty cart', async () => {
    const { cartTotal } = await import('@/lib/cart/cartTypes')
    expect(cartTotal([])).toBe(0)
  })

  it('applies free shipping above threshold', async () => {
    const { shippingCost } = await import('@/lib/cart/cartTypes')
    expect(shippingCost(32)).toBe(0)
    expect(shippingCost(20)).toBe(0)
    expect(shippingCost(19)).toBe(3.99)
  })

  it('calculates order total with shipping', async () => {
    const { orderTotal } = await import('@/lib/cart/cartTypes')
    const cheapCart: CartItem[] = [{
      id: '1', name: 'Cord', baseStyle: 'cord',
      price: 10, quantity: 1, addOns: {}, imageUrl: '',
    }]
    expect(orderTotal(cheapCart)).toBeCloseTo(13.99)
  })
})
