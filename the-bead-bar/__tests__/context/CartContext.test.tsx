import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'
import type { CartItem } from '@/lib/cart/cartTypes'

beforeEach(() => {
  localStorage.clear()
  jest.clearAllMocks()
})

const ITEM_A: CartItem = {
  id: 'a', name: 'Sage Beaded', baseStyle: 'beaded',
  price: 12, quantity: 1, addOns: {}, imageUrl: '/img/a.jpg',
}
const ITEM_B: CartItem = {
  id: 'b', name: 'Cream Cord', baseStyle: 'cord',
  price: 10, quantity: 1, addOns: {}, imageUrl: '/img/b.jpg',
}

// Test harness component
function CartHarness({ onRender }: { onRender: (cart: ReturnType<typeof useCart>) => void }) {
  const cart = useCart()
  onRender(cart)
  return (
    <div>
      <span data-testid="count">{cart.itemCount}</span>
      <span data-testid="total">{cart.total}</span>
      <button onClick={() => cart.addItem(ITEM_A)}>Add A</button>
      <button onClick={() => cart.addItem(ITEM_B)}>Add B</button>
      <button onClick={() => cart.removeItem('a')}>Remove A</button>
      <button onClick={() => cart.updateQuantity('a', 3)}>Set A qty 3</button>
      <button onClick={() => cart.clearCart()}>Clear</button>
    </div>
  )
}

function renderCart() {
  let cartRef: ReturnType<typeof useCart>
  render(
    <CartProvider>
      <CartHarness onRender={c => { cartRef = c }} />
    </CartProvider>
  )
  return { getCart: () => cartRef! }
}

// ─── INITIAL STATE ───────────────────────────────────────────────────────────

describe('CartContext — Initial state', () => {
  it('starts with empty items', () => {
    renderCart()
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('starts with zero total', () => {
    renderCart()
    expect(screen.getByTestId('total')).toHaveTextContent('0')
  })
})

// ─── ADD ITEM ────────────────────────────────────────────────────────────────

describe('CartContext — addItem', () => {
  it('adds an item to the cart', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('increases total when item is added', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    expect(screen.getByTestId('total')).toHaveTextContent('12')
  })

  it('increments quantity when same item is added twice', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('adds multiple different items', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /add b/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('total')).toHaveTextContent('22')
  })
})

// ─── REMOVE ITEM ─────────────────────────────────────────────────────────────

describe('CartContext — removeItem', () => {
  it('removes an item from the cart', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /remove a/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('reduces total when item is removed', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /add b/i }))
    fireEvent.click(screen.getByRole('button', { name: /remove a/i }))
    expect(screen.getByTestId('total')).toHaveTextContent('10')
  })

  it('does nothing when removing non-existent item', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /remove a/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})

// ─── UPDATE QUANTITY ──────────────────────────────────────────────────────────

describe('CartContext — updateQuantity', () => {
  it('updates item quantity', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /set a qty 3/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('3')
  })

  it('updates total when quantity changes', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /set a qty 3/i }))
    expect(screen.getByTestId('total')).toHaveTextContent('36')
  })
})

// ─── CLEAR CART ───────────────────────────────────────────────────────────────

describe('CartContext — clearCart', () => {
  it('removes all items', () => {
    renderCart()
    fireEvent.click(screen.getByRole('button', { name: /add a/i }))
    fireEvent.click(screen.getByRole('button', { name: /add b/i }))
    fireEvent.click(screen.getByRole('button', { name: /clear/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
  })
})

// ─── THROWS WITHOUT PROVIDER ──────────────────────────────────────────────────

describe('CartContext — safety', () => {
  it('throws when useCart is used outside CartProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    function Bare() { useCart(); return null }
    expect(() => render(<Bare />)).toThrow()
    consoleSpy.mockRestore()
  })
})
