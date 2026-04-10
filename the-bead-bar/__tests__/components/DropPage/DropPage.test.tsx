import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DropPage } from '@/components/DropPage/DropPage'
import { DropState } from '@/lib/drops/state'

const BASE_DROP = {
  id: 'spring-bloom-2026',
  name: 'Spring Bloom',
  theme: 'Pastel florals, friendship',
  launchDate: new Date('2026-04-15T12:00:00Z'),
  previewImageUrl: '/images/spring-bloom-preview.jpg',
}

// ─── UPCOMING STATE ──────────────────────────────────────────────────────────

describe('DropPage — Upcoming state', () => {
  const props = { drop: BASE_DROP, state: DropState.UPCOMING, stock: 20 }

  it('renders the drop name', () => {
    render(<DropPage {...props} />)
    expect(screen.getByText(/spring bloom/i)).toBeInTheDocument()
  })

  it('renders a countdown timer', () => {
    render(<DropPage {...props} />)
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
  })

  it('renders the sneak peek image', () => {
    render(<DropPage {...props} />)
    expect(screen.getByTestId('sneak-peek-image')).toBeInTheDocument()
  })

  it('renders the Notify Me form', () => {
    render(<DropPage {...props} />)
    expect(screen.getByTestId('notify-me-form')).toBeInTheDocument()
  })

  it('renders an email input in the Notify Me form', () => {
    render(<DropPage {...props} />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('renders the age confirmation checkbox', () => {
    render(<DropPage {...props} />)
    expect(screen.getByRole('checkbox', { name: /13/i })).toBeInTheDocument()
  })

  it('does not render LIVE badge', () => {
    render(<DropPage {...props} />)
    expect(screen.queryByTestId('live-badge')).not.toBeInTheDocument()
  })

  it('does not render SOLD OUT badge', () => {
    render(<DropPage {...props} />)
    expect(screen.queryByTestId('sold-out-badge')).not.toBeInTheDocument()
  })
})

// ─── UPCOMING FORM VALIDATION ────────────────────────────────────────────────

describe('DropPage — Notify Me form validation', () => {
  const props = { drop: BASE_DROP, state: DropState.UPCOMING, stock: 20 }

  it('submit button is disabled when email is empty', () => {
    render(<DropPage {...props} />)
    const submit = screen.getByRole('button', { name: /notify me/i })
    expect(submit).toBeDisabled()
  })

  it('submit button is disabled when email is filled but age not confirmed', () => {
    render(<DropPage {...props} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    expect(screen.getByRole('button', { name: /notify me/i })).toBeDisabled()
  })

  it('submit button is disabled when age confirmed but email is empty', () => {
    render(<DropPage {...props} />)
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    expect(screen.getByRole('button', { name: /notify me/i })).toBeDisabled()
  })

  it('submit button is enabled when email is filled AND age confirmed', () => {
    render(<DropPage {...props} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    fireEvent.click(screen.getByTestId('marketing-consent'))
    expect(screen.getByRole('button', { name: /notify me/i })).toBeEnabled()
  })

  it('calls onNotifySubmit with email when form is submitted', async () => {
    const onNotifySubmit = jest.fn()
    render(<DropPage {...props} onNotifySubmit={onNotifySubmit} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    fireEvent.click(screen.getByTestId('marketing-consent'))
    fireEvent.click(screen.getByRole('button', { name: /notify me/i }))
    expect(onNotifySubmit).toHaveBeenCalledWith('test@example.com', undefined)
  })

  it('shows success message after submission', async () => {
    const onNotifySubmit = jest.fn()
    render(<DropPage {...props} onNotifySubmit={onNotifySubmit} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    fireEvent.click(screen.getByTestId('marketing-consent'))
    fireEvent.click(screen.getByRole('button', { name: /notify me/i }))
    await waitFor(() => {
      expect(screen.getByTestId('notify-success')).toBeInTheDocument()
    })
  })
})

// ─── LIVE STATE ──────────────────────────────────────────────────────────────

describe('DropPage — Live state', () => {
  it('renders LIVE NOW badge', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={10} />)
    expect(screen.getByTestId('live-badge')).toBeInTheDocument()
    expect(screen.getByTestId('live-badge')).toHaveTextContent(/live now/i)
  })

  it('does not render countdown timer', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={10} />)
    expect(screen.queryByTestId('countdown-timer')).not.toBeInTheDocument()
  })

  it('does not render Notify Me form', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={10} />)
    expect(screen.queryByTestId('notify-me-form')).not.toBeInTheDocument()
  })

  it('shows remaining stock count', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={8} />)
    expect(screen.getByTestId('stock-count')).toHaveTextContent('8')
  })

  it('shows urgency message when stock is 3 or fewer', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={3} />)
    expect(screen.getByTestId('urgency-message')).toBeInTheDocument()
    expect(screen.getByTestId('urgency-message')).toHaveTextContent(/only 3 left/i)
  })

  it('does not show urgency message when stock is above 3', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={10} />)
    expect(screen.queryByTestId('urgency-message')).not.toBeInTheDocument()
  })

  it('shows urgency message when stock is 1', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.LIVE} stock={1} />)
    expect(screen.getByTestId('urgency-message')).toHaveTextContent(/only 1 left/i)
  })
})

// ─── SOLD OUT STATE ───────────────────────────────────────────────────────────

describe('DropPage — Sold Out state', () => {
  const props = { drop: BASE_DROP, state: DropState.SOLD_OUT, stock: 0 }

  it('renders SOLD OUT badge', () => {
    render(<DropPage {...props} />)
    expect(screen.getByTestId('sold-out-badge')).toBeInTheDocument()
    expect(screen.getByTestId('sold-out-badge')).toHaveTextContent(/sold out/i)
  })

  it('does not render LIVE badge', () => {
    render(<DropPage {...props} />)
    expect(screen.queryByTestId('live-badge')).not.toBeInTheDocument()
  })

  it('renders the waitlist form', () => {
    render(<DropPage {...props} />)
    expect(screen.getByTestId('waitlist-form')).toBeInTheDocument()
  })

  it('renders age confirmation checkbox in waitlist form', () => {
    render(<DropPage {...props} />)
    expect(screen.getByRole('checkbox', { name: /13/i })).toBeInTheDocument()
  })

  it('waitlist submit is disabled when email empty', () => {
    render(<DropPage {...props} />)
    expect(screen.getByRole('button', { name: /join waitlist/i })).toBeDisabled()
  })

  it('waitlist submit is enabled when email + age confirmed', () => {
    render(<DropPage {...props} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    fireEvent.click(screen.getByTestId('marketing-consent'))
    expect(screen.getByRole('button', { name: /join waitlist/i })).toBeEnabled()
  })

  it('calls onWaitlistSubmit with email when submitted', () => {
    const onWaitlistSubmit = jest.fn()
    render(<DropPage {...props} onWaitlistSubmit={onWaitlistSubmit} />)
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: /13/i }))
    fireEvent.click(screen.getByTestId('marketing-consent'))
    fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
    expect(onWaitlistSubmit).toHaveBeenCalledWith('test@example.com', undefined)
  })
})

// ─── ENDED STATE ─────────────────────────────────────────────────────────────

describe('DropPage — Ended state', () => {
  it('renders ended message', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.ENDED} stock={0} />)
    expect(screen.getByTestId('ended-message')).toBeInTheDocument()
  })

  it('does not render any form', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.ENDED} stock={0} />)
    expect(screen.queryByTestId('notify-me-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('waitlist-form')).not.toBeInTheDocument()
  })

  it('does not render live or sold out badge', () => {
    render(<DropPage drop={BASE_DROP} state={DropState.ENDED} stock={0} />)
    expect(screen.queryByTestId('live-badge')).not.toBeInTheDocument()
    expect(screen.queryByTestId('sold-out-badge')).not.toBeInTheDocument()
  })
})
