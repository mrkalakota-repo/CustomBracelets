import { render, screen, fireEvent, within } from '@testing-library/react'
import { ShopPage } from '@/components/Shop/ShopPage'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}))

const PRODUCTS = [
  { id: '1', name: 'Sage Beaded',   type: 'beaded',    price: 12, imageUrl: '/img/1.jpg', occasion: 'everyday' },
  { id: '2', name: 'Cream String',  type: 'string',      price: 10, imageUrl: '/img/2.jpg', occasion: 'everyday' },
  { id: '3', name: 'Gold Chain',    type: 'chain',     price: 18, imageUrl: '/img/3.jpg', occasion: 'gift' },
  { id: '4', name: 'Charm Stack',   type: 'stackable', price: 25, imageUrl: '/img/4.jpg', occasion: 'gift' },
  { id: '5', name: 'Rose Beaded',   type: 'beaded',    price: 12, imageUrl: '/img/5.jpg', occasion: 'valentines' },
]

// ─── RENDERING ───────────────────────────────────────────────────────────────

describe('ShopPage — Rendering', () => {
  it('renders the shop page', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getByTestId('shop-page')).toBeInTheDocument()
  })

  it('renders all products by default', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(5)
  })

  it('renders each product name', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getByText('Sage Beaded')).toBeInTheDocument()
    expect(screen.getByText('Gold Chain')).toBeInTheDocument()
    expect(screen.getByText('Charm Stack')).toBeInTheDocument()
  })

  it('renders each product price', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getAllByText('$12')).toHaveLength(2)
    expect(screen.getByText('$18')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
  })

  it('renders an image for each product', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getAllByRole('img')).toHaveLength(5)
  })

  it('renders empty state when no products provided', () => {
    render(<ShopPage products={[]} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('product-card')).not.toBeInTheDocument()
  })
})

// ─── FILTER CONTROLS ─────────────────────────────────────────────────────────

describe('ShopPage — Filter Controls', () => {
  it('renders filter controls', () => {
    render(<ShopPage products={PRODUCTS} />)
    expect(screen.getByTestId('filters')).toBeInTheDocument()
  })

  it('renders type filter buttons', () => {
    render(<ShopPage products={PRODUCTS} />)
    const filters = screen.getByTestId('filters')
    expect(within(filters).getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /beaded/i })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /string/i })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /chain/i })).toBeInTheDocument()
    expect(within(filters).getByRole('button', { name: /stackable/i })).toBeInTheDocument()
  })

  it('"All" filter is active by default', () => {
    render(<ShopPage products={PRODUCTS} />)
    const all = within(screen.getByTestId('filters')).getByRole('button', { name: /all/i })
    expect(all).toHaveAttribute('data-active', 'true')
  })

  it('type filter becomes active when clicked', () => {
    render(<ShopPage products={PRODUCTS} />)
    const beadedBtn = within(screen.getByTestId('filters')).getByRole('button', { name: /beaded/i })
    fireEvent.click(beadedBtn)
    expect(beadedBtn).toHaveAttribute('data-active', 'true')
  })

  it('"All" becomes inactive when a type filter is selected', () => {
    render(<ShopPage products={PRODUCTS} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /beaded/i }))
    const all = within(screen.getByTestId('filters')).getByRole('button', { name: /all/i })
    expect(all).toHaveAttribute('data-active', 'false')
  })
})

// ─── FILTERING BEHAVIOUR ─────────────────────────────────────────────────────

describe('ShopPage — Filtering', () => {
  it('filters to only beaded products when beaded is selected', () => {
    render(<ShopPage products={PRODUCTS} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /beaded/i }))
    const cards = screen.getAllByTestId('product-card')
    expect(cards).toHaveLength(2)
    expect(screen.getByText('Sage Beaded')).toBeInTheDocument()
    expect(screen.getByText('Rose Beaded')).toBeInTheDocument()
    expect(screen.queryByText('Gold Chain')).not.toBeInTheDocument()
  })

  it('filters to only chain products when chain is selected', () => {
    render(<ShopPage products={PRODUCTS} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /chain/i }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
    expect(screen.getByText('Gold Chain')).toBeInTheDocument()
  })

  it('shows all products when All is clicked after a filter', () => {
    render(<ShopPage products={PRODUCTS} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /beaded/i }))
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /all/i }))
    expect(screen.getAllByTestId('product-card')).toHaveLength(5)
  })

  it('shows empty state when filter matches no products', () => {
    render(<ShopPage products={PRODUCTS} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /stackable/i }))
    // only 1 stackable product, so still shows
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
  })

  it('shows empty state message when filter has zero results', () => {
    const noStackable = PRODUCTS.filter(p => p.type !== 'stackable')
    render(<ShopPage products={noStackable} />)
    fireEvent.click(within(screen.getByTestId('filters')).getByRole('button', { name: /stackable/i }))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})

// ─── INITIAL TYPE FILTER FROM PROP ───────────────────────────────────────────

describe('ShopPage — Initial filter from prop', () => {
  it('pre-selects type filter when initialType prop is provided', () => {
    render(<ShopPage products={PRODUCTS} initialType="string" />)
    const stringBtn = within(screen.getByTestId('filters')).getByRole('button', { name: /string/i })
    expect(stringBtn).toHaveAttribute('data-active', 'true')
    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
  })
})

// ─── PRODUCT CARD LINKS ───────────────────────────────────────────────────────

describe('ShopPage — Product Card Links', () => {
  it('each product card links to the product detail page', () => {
    render(<ShopPage products={PRODUCTS} />)
    const cards = screen.getAllByTestId('product-card')
    expect(cards[0].closest('a')).toHaveAttribute('href', '/shop/1')
  })
})
