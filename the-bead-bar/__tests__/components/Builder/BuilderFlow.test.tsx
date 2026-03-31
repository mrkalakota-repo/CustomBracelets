import { render, screen, fireEvent } from '@testing-library/react'
import { BuilderFlow } from '@/components/Builder/BuilderFlow'

describe('BuilderFlow — Step Navigation', () => {
  it('renders step 1 (base style) on initial load', () => {
    render(<BuilderFlow />)
    expect(screen.getByTestId('step-1')).toBeInTheDocument()
    expect(screen.queryByTestId('step-2')).not.toBeInTheDocument()
  })

  it('shows all base style options in step 1', () => {
    render(<BuilderFlow />)
    expect(screen.getByRole('button', { name: /beaded/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cord/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chain/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /charm/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stackable/i })).toBeInTheDocument()
  })

  it('advances to step 2 after selecting a base style', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    expect(screen.getByTestId('step-2')).toBeInTheDocument()
    expect(screen.queryByTestId('step-1')).not.toBeInTheDocument()
  })

  it('advances to step 3 after selecting a color', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0]) // first color option
    expect(screen.getByTestId('step-3')).toBeInTheDocument()
  })

  it('advances to step 4 after selecting a pattern', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByTestId('step-4')).toBeInTheDocument()
  })

  it('advances to step 5 (preview) when add-ons are skipped', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(screen.getByTestId('step-5')).toBeInTheDocument()
  })
})

describe('BuilderFlow — Step Indicator', () => {
  it('renders 5 step indicators', () => {
    render(<BuilderFlow />)
    expect(screen.getByTestId('step-indicator')).toBeInTheDocument()
    const steps = screen.getAllByTestId(/^step-dot-/)
    expect(steps).toHaveLength(5)
  })

  it('marks step 1 as active on initial load', () => {
    render(<BuilderFlow />)
    expect(screen.getByTestId('step-dot-1')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTestId('step-dot-2')).toHaveAttribute('data-active', 'false')
  })

  it('marks step 2 as active after selecting base style', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    expect(screen.getByTestId('step-dot-1')).toHaveAttribute('data-active', 'false')
    expect(screen.getByTestId('step-dot-2')).toHaveAttribute('data-active', 'true')
  })
})

describe('BuilderFlow — Compatibility Enforcement', () => {
  it('only shows cord-compatible patterns after selecting cord base', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /cord/i }))
    fireEvent.click(screen.getAllByRole('button')[0]) // first color
    expect(screen.getByRole('button', { name: /knotted/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /braided/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /checker/i })).not.toBeInTheDocument()
  })

  it('only shows beaded-compatible patterns after selecting beaded base', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByRole('button', { name: /stripe/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /knotted/i })).not.toBeInTheDocument()
  })

  it('skips pattern step and goes straight to add-ons for charm base', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /charm/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(screen.getByTestId('step-4')).toBeInTheDocument()
  })
})

describe('BuilderFlow — Step Reset', () => {
  it('resets downstream steps when Back is pressed to step 1', () => {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    // Back at step 1 — changing base should clear color/pattern
    fireEvent.click(screen.getByRole('button', { name: /cord/i }))
    // Step 2 now shows cord colors — no previously selected state leaking
    expect(screen.getByTestId('step-2')).toBeInTheDocument()
  })
})

describe('BuilderFlow — Preview Step', () => {
  function completeBuilder() {
    render(<BuilderFlow />)
    fireEvent.click(screen.getByRole('button', { name: /beaded/i }))
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getAllByRole('button')[0])
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
  }

  it('shows a summary of all selections in the preview', () => {
    completeBuilder()
    expect(screen.getByTestId('preview-summary')).toBeInTheDocument()
  })

  it('shows an Add to Cart button in the preview', () => {
    completeBuilder()
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })

  it('shows a Share button in the preview', () => {
    completeBuilder()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })
})
