import { render, screen, fireEvent } from '@testing-library/react'
import { ShareCard } from '@/components/ShareCard/ShareCard'

const BASE_SELECTION = {
  baseStyle:     'beaded'  as const,
  primaryColor:  'sage-green',
  accentPattern: 'stripe',
  addOns:        {},
}

const BRAND_URL = 'wristbloom.com'

// ─── CONTENT RENDERING ───────────────────────────────────────────────────────

describe('ShareCard — Content', () => {
  it('renders the card container', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('share-card')).toBeInTheDocument()
  })

  it('renders the bracelet type label', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-bracelet-type')).toHaveTextContent(/beaded/i)
  })

  it('renders the primary color label', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-color')).toHaveTextContent(/sage green/i)
  })

  it('renders the accent pattern label', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-pattern')).toHaveTextContent(/stripe/i)
  })

  it('renders the brand URL', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-brand-url')).toHaveTextContent(BRAND_URL)
  })

  it('renders a bracelet preview image area', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-preview')).toBeInTheDocument()
  })

  it('renders charm label when charm add-on is selected', () => {
    const selection = { ...BASE_SELECTION, addOns: { charm: 'star' } }
    render(<ShareCard selection={selection} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-charm')).toHaveTextContent(/star/i)
  })

  it('does not render charm label when no charm selected', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.queryByTestId('card-charm')).not.toBeInTheDocument()
  })

  it('renders custom text when text add-on is selected', () => {
    const selection = { ...BASE_SELECTION, addOns: { text: 'BFF' } }
    render(<ShareCard selection={selection} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-text')).toHaveTextContent('BFF')
  })

  it('does not render text label when no text selected', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.queryByTestId('card-text')).not.toBeInTheDocument()
  })

  it('does not render pattern label when accentPattern is null', () => {
    const selection = { ...BASE_SELECTION, accentPattern: null }
    render(<ShareCard selection={selection} brandUrl={BRAND_URL} />)
    expect(screen.queryByTestId('card-pattern')).not.toBeInTheDocument()
  })
})

// ─── COLOR LABEL FORMATTING ──────────────────────────────────────────────────

describe('ShareCard — Color label formatting', () => {
  it('formats sage-green as "Sage Green"', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-color')).toHaveTextContent('Sage Green')
  })

  it('formats dip-dye as "Dip-Dye"', () => {
    const selection = { ...BASE_SELECTION, primaryColor: 'dip-dye', accentPattern: 'solid' }
    render(<ShareCard selection={selection} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-color')).toHaveTextContent('Dip-Dye')
  })

  it('formats two-tone pattern as "Two-Tone"', () => {
    const selection = { ...BASE_SELECTION, accentPattern: 'two-tone' }
    render(<ShareCard selection={selection} brandUrl={BRAND_URL} />)
    expect(screen.getByTestId('card-pattern')).toHaveTextContent('Two-Tone')
  })
})

// ─── SHARE BUTTON ─────────────────────────────────────────────────────────────

describe('ShareCard — Share button', () => {
  it('renders a Share button', () => {
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('calls navigator.share when Web Share API is available', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      value: mockShare, writable: true, configurable: true,
    })
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(mockShare).toHaveBeenCalled()
  })

  it('passes brand URL to navigator.share', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      value: mockShare, writable: true, configurable: true,
    })
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(mockShare).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining(BRAND_URL) })
    )
  })

  it('shows a download fallback button when Web Share API is unavailable', () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined, writable: true, configurable: true,
    })
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} />)
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
  })

  it('calls onShare callback when provided and share is clicked', () => {
    const mockShare = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', {
      value: mockShare, writable: true, configurable: true,
    })
    const onShare = jest.fn()
    render(<ShareCard selection={BASE_SELECTION} brandUrl={BRAND_URL} onShare={onShare} />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(onShare).toHaveBeenCalled()
  })
})
