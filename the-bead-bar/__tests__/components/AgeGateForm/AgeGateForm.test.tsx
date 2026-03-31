import { render, screen, fireEvent } from '@testing-library/react'
import { AgeGateForm } from '@/components/AgeGateForm/AgeGateForm'

// ─── RENDERING ───────────────────────────────────────────────────────────────

describe('AgeGateForm — Rendering', () => {
  it('renders a checkbox', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders the default 13+ label', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    expect(screen.getByText(/13/)).toBeInTheDocument()
  })

  it('renders 18+ label when minAge is 18', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} minAge={18} />)
    expect(screen.getByText(/18/)).toBeInTheDocument()
    expect(screen.queryByText(/confirm i am 13/i)).not.toBeInTheDocument()
  })

  it('checkbox is unchecked by default when checked=false', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('checkbox is checked when checked=true', () => {
    render(<AgeGateForm checked={true} onChange={jest.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('has an accessible aria-label', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAccessibleName()
  })
})

// ─── INTERACTION ─────────────────────────────────────────────────────────────

describe('AgeGateForm — Interaction', () => {
  it('calls onChange with true when unchecked box is clicked', () => {
    const onChange = jest.fn()
    render(<AgeGateForm checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when checked box is clicked', () => {
    const onChange = jest.fn()
    render(<AgeGateForm checked={true} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('calls onChange exactly once per click', () => {
    const onChange = jest.fn()
    render(<AgeGateForm checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn()
    render(<AgeGateForm checked={false} onChange={onChange} disabled />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('checkbox is not interactive when disabled', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})

// ─── VALIDATION / ERROR STATE ────────────────────────────────────────────────

describe('AgeGateForm — Validation', () => {
  it('does not show error message by default', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows error message when showError=true and not checked', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} showError />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('error message references the required age (13)', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} showError />)
    expect(screen.getByRole('alert')).toHaveTextContent(/13/)
  })

  it('error message references the required age (18) for BNPL gate', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} showError minAge={18} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/18/)
  })

  it('does not show error when showError=true but already checked', () => {
    render(<AgeGateForm checked={true} onChange={jest.fn()} showError />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ─── BNPL VARIANT ─────────────────────────────────────────────────────────────

describe('AgeGateForm — BNPL (18+) variant', () => {
  it('renders 18+ label text', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} minAge={18} />)
    expect(screen.getByLabelText(/18/i)).toBeInTheDocument()
  })

  it('renders a note that BNPL requires 18+', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} minAge={18} showBnplNote />)
    expect(screen.getByTestId('bnpl-note')).toBeInTheDocument()
  })

  it('does not render BNPL note when showBnplNote is false', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} minAge={18} />)
    expect(screen.queryByTestId('bnpl-note')).not.toBeInTheDocument()
  })
})

// ─── ACCESSIBILITY ────────────────────────────────────────────────────────────

describe('AgeGateForm — Accessibility', () => {
  it('label is associated with the checkbox via htmlFor', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('id')
    // clicking label toggles checkbox
    const label = screen.getByText(/13/)
    fireEvent.click(label)
    // onChange should be triggered via label click
  })

  it('error message has role=alert for screen readers', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} showError />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('checkbox has aria-required attribute', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
  })

  it('checkbox has aria-invalid=true when showError and unchecked', () => {
    render(<AgeGateForm checked={false} onChange={jest.fn()} showError />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('checkbox has aria-invalid=false when checked', () => {
    render(<AgeGateForm checked={true} onChange={jest.fn()} showError />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'false')
  })
})
