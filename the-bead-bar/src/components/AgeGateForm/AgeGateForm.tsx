interface AgeGateFormProps {
  checked:       boolean
  onChange:      (checked: boolean) => void
  minAge?:       13 | 18
  disabled?:     boolean
  showError?:    boolean
  showBnplNote?: boolean
}

export function AgeGateForm({
  checked,
  onChange,
  minAge       = 13,
  disabled     = false,
  showError    = false,
  showBnplNote = false,
}: AgeGateFormProps) {
  const id      = `age-gate-${minAge}`
  const isError = showError && !checked
  const label   = `I confirm I am ${minAge} years or older`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          role="checkbox"
          checked={checked}
          disabled={disabled}
          aria-required="true"
          aria-invalid={String(isError) as 'true' | 'false'}
          aria-label={label}
          className="w-4 h-4 accent-sage cursor-pointer disabled:cursor-not-allowed"
          onChange={e => {
            if (!disabled) onChange(e.target.checked)
          }}
        />
        <label htmlFor={id} className="text-sm text-text-mid cursor-pointer select-none">{label}</label>
      </div>

      {isError && (
        <p role="alert" className="text-xs text-red-500">
          You must confirm you are {minAge} or older to continue.
        </p>
      )}

      {showBnplNote && (
        <p data-testid="bnpl-note" className="text-xs text-text-light">
          Buy Now Pay Later options (Afterpay, Klarna) are available to buyers aged 18 and over.
        </p>
      )}
    </div>
  )
}
