import { render, screen } from '@testing-library/react'
import { HomePage } from '@/components/Home/HomePage'
import { DropState } from '@/lib/drops/state'

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Sage Beaded',    type: 'beaded',    price: 12, imageUrl: '/img/1.jpg' },
  { id: '2', name: 'Cream Cord',     type: 'cord',      price: 10, imageUrl: '/img/2.jpg' },
  { id: '3', name: 'Gold Chain',     type: 'chain',     price: 18, imageUrl: '/img/3.jpg' },
  { id: '4', name: 'Charm Stack',    type: 'stackable', price: 25, imageUrl: '/img/4.jpg' },
]

const ACTIVE_DROP = {
  id:              'spring-bloom-2026',
  name:            'Spring Bloom',
  launchDate:      new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
  state:           DropState.UPCOMING,
  previewImageUrl: '/img/drop.jpg',
}

// ─── HERO ────────────────────────────────────────────────────────────────────

describe('HomePage — Hero', () => {
  it('renders the hero section', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
  })

  it('renders a hero headline', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('hero-headline')).toBeInTheDocument()
  })

  it('renders a Shop Now CTA button in the hero', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument()
  })

  it('renders a Build Yours CTA button in the hero', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /build yours/i })).toBeInTheDocument()
  })
})

// ─── DROP STRIP ───────────────────────────────────────────────────────────────

describe('HomePage — Active Drop Strip', () => {
  it('renders drop strip when an active drop is provided', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} activeDrop={ACTIVE_DROP} />)
    expect(screen.getByTestId('drop-strip')).toBeInTheDocument()
  })

  it('shows the drop name in the strip', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} activeDrop={ACTIVE_DROP} />)
    expect(screen.getByTestId('drop-strip')).toHaveTextContent(/spring bloom/i)
  })

  it('shows a countdown timer in the strip for upcoming drop', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} activeDrop={ACTIVE_DROP} />)
    expect(screen.getByTestId('drop-strip-timer')).toBeInTheDocument()
  })

  it('shows LIVE NOW label in strip for live drop', () => {
    const liveDrop = { ...ACTIVE_DROP, state: DropState.LIVE }
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} activeDrop={liveDrop} />)
    expect(screen.getByTestId('drop-strip')).toHaveTextContent(/live now/i)
  })

  it('does not render drop strip when no active drop', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.queryByTestId('drop-strip')).not.toBeInTheDocument()
  })

  it('renders a link to the drop page in the strip', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} activeDrop={ACTIVE_DROP} />)
    expect(screen.getByRole('link', { name: /see drop/i })).toBeInTheDocument()
  })
})

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

describe('HomePage — Shop by Category', () => {
  it('renders the category section', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('categories')).toBeInTheDocument()
  })

  it('renders all 4 bracelet category links', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    const cats = screen.getByTestId('categories')
    expect(cats.querySelector('a[href="/shop?type=beaded"]')).toBeInTheDocument()
    expect(cats.querySelector('a[href="/shop?type=cord"]')).toBeInTheDocument()
    expect(cats.querySelector('a[href="/shop?type=chain"]')).toBeInTheDocument()
    expect(cats.querySelector('a[href="/shop?type=stackable"]')).toBeInTheDocument()
  })

  it('each category link points to /shop with a type filter', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    const cats = screen.getByTestId('categories')
    expect(cats.querySelector('a[href="/shop?type=beaded"]')).toHaveAttribute('href', '/shop?type=beaded')
    expect(cats.querySelector('a[href="/shop?type=cord"]')).toHaveAttribute('href', '/shop?type=cord')
  })
})

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────

describe('HomePage — Featured Products', () => {
  it('renders the featured section', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('featured')).toBeInTheDocument()
  })

  it('renders all 4 featured products', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(4)
  })

  it('each product card shows the product name', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByText('Sage Beaded')).toBeInTheDocument()
    expect(screen.getByText('Gold Chain')).toBeInTheDocument()
  })

  it('each product card shows the price', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByText('$12')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
  })

  it('renders no more than 4 featured products even if more are passed', () => {
    const extra = [...FEATURED_PRODUCTS, { id: '5', name: 'Extra', type: 'beaded', price: 10, imageUrl: '' }]
    render(<HomePage featuredProducts={extra} />)
    expect(screen.getAllByTestId('product-card')).toHaveLength(4)
  })
})

// ─── BUILD YOUR OWN CTA ───────────────────────────────────────────────────────

describe('HomePage — Build Your Own CTA', () => {
  it('renders the builder CTA section', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('builder-cta')).toBeInTheDocument()
  })

  it('renders a link to the builder', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /design your bracelet/i })).toHaveAttribute('href', '/builder')
  })
})

// ─── BFF BANNER ───────────────────────────────────────────────────────────────

describe('HomePage — BFF Banner', () => {
  it('renders the BFF banner section', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByTestId('bff-banner')).toBeInTheDocument()
  })

  it('renders a link to the BFF builder', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /match with your bestie/i })).toHaveAttribute('href', '/builder?mode=bff')
  })
})

// ─── FOOTER ───────────────────────────────────────────────────────────────────

describe('HomePage — Footer', () => {
  it('renders the footer', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders links to policy pages', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /returns/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /shipping/i })).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<HomePage featuredProducts={FEATURED_PRODUCTS} />)
    expect(screen.getByRole('link', { name: /tiktok/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pinterest/i })).toBeInTheDocument()
  })
})
