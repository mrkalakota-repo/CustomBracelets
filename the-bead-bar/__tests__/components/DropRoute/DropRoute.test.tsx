import { render, screen } from '@testing-library/react'
import { DropRoute } from '@/components/DropPage/DropRoute'
import { DropState } from '@/lib/drops/state'

const UPCOMING_DROP = {
  id:              'spring-bloom-2026',
  name:            'Spring Bloom',
  theme:           'Pastel florals',
  launchDate:      new Date(Date.now() + 1000 * 60 * 60 * 2),
  stock:           20,
  previewImageUrl: '/images/drops/spring-bloom.jpg',
}

const LIVE_DROP = {
  ...UPCOMING_DROP,
  launchDate: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
}

const SOLD_OUT_DROP = {
  ...LIVE_DROP,
  stock: 0,
}

// ─── STATE DERIVATION ─────────────────────────────────────────────────────────

describe('DropRoute — State derivation', () => {
  it('renders DropPage in UPCOMING state when launch is in future', () => {
    render(<DropRoute drop={UPCOMING_DROP} />)
    expect(screen.getByTestId('notify-me-form')).toBeInTheDocument()
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
  })

  it('renders DropPage in LIVE state when launch has passed and stock > 0', () => {
    render(<DropRoute drop={LIVE_DROP} />)
    expect(screen.getByTestId('live-badge')).toBeInTheDocument()
    expect(screen.getByTestId('stock-count')).toHaveTextContent('20')
  })

  it('renders DropPage in SOLD_OUT state when stock is 0', () => {
    render(<DropRoute drop={SOLD_OUT_DROP} />)
    expect(screen.getByTestId('sold-out-badge')).toBeInTheDocument()
    expect(screen.getByTestId('waitlist-form')).toBeInTheDocument()
  })

  it('renders drop name from drop data', () => {
    render(<DropRoute drop={UPCOMING_DROP} />)
    expect(screen.getByText(/spring bloom/i)).toBeInTheDocument()
  })
})

// ─── NOT FOUND ────────────────────────────────────────────────────────────────

describe('DropRoute — Not found', () => {
  it('renders not-found message when drop is null', () => {
    render(<DropRoute drop={null} />)
    expect(screen.getByTestId('drop-not-found')).toBeInTheDocument()
  })

  it('shows a link back to shop on not-found', () => {
    render(<DropRoute drop={null} />)
    expect(screen.getByRole('link', { name: /browse all/i })).toBeInTheDocument()
  })
})

// ─── REGISTRY INTEGRATION ────────────────────────────────────────────────────

describe('getDropById', () => {
  it('returns the correct drop for a valid id', async () => {
    const { getDropById } = await import('@/lib/drops/registry')
    const drop = getDropById('spring-bloom-2026')
    expect(drop).toBeDefined()
    expect(drop?.name).toBe('Spring Bloom')
  })

  it('returns undefined for an unknown id', async () => {
    const { getDropById } = await import('@/lib/drops/registry')
    expect(getDropById('does-not-exist')).toBeUndefined()
  })
})
