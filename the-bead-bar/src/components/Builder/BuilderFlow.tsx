'use client'

import { useState } from 'react'
import type { BaseStyle } from '@/lib/builder/compatibility'
import { BASE_STYLES, SEASONAL_COLORS, PATTERNS, CHARMS } from './builderData'
import { calculatePrice } from '@/lib/builder/pricing'
import type { CartItem } from '@/lib/cart/cartTypes'

interface BuilderState {
  baseStyle:     BaseStyle | null
  primaryColor:  string | null
  accentPattern: string | null
  addOns: {
    charm?:    string
    text?:     string
    giftWrap?: boolean
    rush?:     boolean
    bffDuo?:   boolean
  }
}

interface BuilderFlowProps {
  isBff?:        boolean
  onAddToCart?:  (item: CartItem) => void
}

export function BuilderFlow({ isBff = false, onAddToCart }: BuilderFlowProps) {
  const initialState: BuilderState = {
    baseStyle:     null,
    primaryColor:  null,
    accentPattern: null,
    addOns:        isBff ? { bffDuo: true } : {},
  }
  const [state, setState] = useState<BuilderState>(initialState)
  const [step, setStep]   = useState(1)
  const [done, setDone]   = useState(false)

  function selectBase(base: BaseStyle) {
    setState({ baseStyle: base, primaryColor: null, accentPattern: null, addOns: {} })
    setStep(2)
  }

  function selectColor(color: string) {
    setState(s => ({ ...s, primaryColor: color }))
    // charm has no patterns — skip to add-ons
    if (state.baseStyle === 'charm') {
      setStep(4)
    } else {
      setStep(3)
    }
  }

  function selectPattern(pattern: string) {
    setState(s => ({ ...s, accentPattern: pattern }))
    setStep(4)
  }

  function skipAddOns() {
    setStep(5)
    setDone(true)
  }

  function confirmAddOns() {
    setStep(5)
    setDone(true)
  }

  function handleAddToCart() {
    if (!state.baseStyle || !state.primaryColor) return
    const colorLabel = SEASONAL_COLORS.find(c => c.id === state.primaryColor)?.label ?? state.primaryColor
    const styleLabel = BASE_STYLES.find(s => s.id === state.baseStyle)?.label ?? state.baseStyle
    const name = isBff
      ? `BFF Set — Custom ${colorLabel} ${styleLabel}`
      : `Custom ${colorLabel} ${styleLabel}`
    // price is recalculated server-side; pass a client-side estimate for display
    const price = calculatePrice(state.baseStyle, state.addOns)
    const item: CartItem = {
      id:        Date.now().toString(),
      name,
      baseStyle: state.baseStyle,
      price,
      quantity:  1,
      addOns:    state.addOns,
      imageUrl:  `/images/${state.baseStyle}.svg`,
    }
    onAddToCart?.(item)
  }

  function goBack() {
    if (step === 2) {
      setState({ baseStyle: null, primaryColor: null, accentPattern: null, addOns: isBff ? { bffDuo: true } : {} })
      setStep(1)
    } else if (step === 3) {
      setState(s => ({ ...s, primaryColor: null }))
      setStep(2)
    } else if (step === 4) {
      setState(s => ({ ...s, accentPattern: null, addOns: {} }))
      setStep(state.baseStyle === 'charm' ? 2 : 3)
    } else if (step === 5) {
      setState(s => ({ ...s, addOns: {} }))
      setStep(4)
      setDone(false)
    }
  }

  return (
    <div className="builder-flow page-container py-8">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <div data-testid="step-1" className="flex flex-col gap-4 mt-6">
          <h2 className="text-center">Choose Your Base Style</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {BASE_STYLES.map(({ id, label }) => (
              <button key={id} className="btn-secondary" onClick={() => selectBase(id)}>{label}</button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div data-testid="step-2" className="flex flex-col gap-4 mt-6">
          <h2 className="text-center">Choose Primary Color</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {SEASONAL_COLORS.map(({ id, label }) => (
              <button key={id} className="btn-secondary" onClick={() => selectColor(id)}>{label}</button>
            ))}
          </div>
          <button className="btn-secondary self-start" onClick={goBack}>Back</button>
        </div>
      )}

      {step === 3 && state.baseStyle && (
        <div data-testid="step-3" className="flex flex-col gap-4 mt-6">
          <h2 className="text-center">Choose Accent Pattern</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {PATTERNS[state.baseStyle].map(({ id, label }) => (
              <button key={id} className="btn-secondary" onClick={() => selectPattern(id)}>{label}</button>
            ))}
          </div>
          <button className="btn-secondary self-start" onClick={goBack}>Back</button>
        </div>
      )}

      {step === 4 && (
        <div data-testid="step-4" className="flex flex-col gap-6 mt-6">
          <h2 className="text-center">Add-Ons (Optional)</h2>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text-mid">Choose a charm:</p>
            <div className="flex flex-wrap gap-2">
              {CHARMS.map(({ id, label }) => (
                <button
                  key={id}
                  className="filter-btn"
                  data-active={String(state.addOns.charm === id)}
                  onClick={() => setState(s => ({ ...s, addOns: { ...s.addOns, charm: id } }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-mid">
              Custom text:
              <input
                type="text"
                className="input mt-1"
                onChange={e => setState(s => ({ ...s, addOns: { ...s.addOns, text: e.target.value } }))}
              />
            </label>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={goBack}>Back</button>
            <button className="btn-secondary" onClick={skipAddOns}>Skip</button>
            <button className="btn-primary" onClick={confirmAddOns}>Next</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div data-testid="step-5" className="flex flex-col gap-6 mt-6">
          <h2 className="text-center">{isBff ? 'Your BFF Set' : 'Your Bracelet'}</h2>
          {isBff && (
            <p className="text-center text-sm text-sage font-medium">
              BFF pricing applied — two bracelets, better deal!
            </p>
          )}
          <div data-testid="preview-summary" className="card p-5 flex flex-col gap-2 text-sm">
            <p><span className="text-text-light">Style:</span> <span className="font-medium capitalize">{state.baseStyle}</span></p>
            <p><span className="text-text-light">Color:</span> <span className="font-medium capitalize">{state.primaryColor}</span></p>
            {state.accentPattern && <p><span className="text-text-light">Pattern:</span> <span className="font-medium capitalize">{state.accentPattern}</span></p>}
            {state.addOns.charm && <p><span className="text-text-light">Charm:</span> <span className="font-medium">{state.addOns.charm}</span></p>}
            {state.addOns.text  && <p><span className="text-text-light">Text:</span> <span className="font-medium">{state.addOns.text}</span></p>}
            <p className="pt-1 border-t border-border font-semibold">
              Price: ${calculatePrice(state.baseStyle!, state.addOns).toFixed(2)}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={goBack}>Back</button>
            <button className="btn-secondary">Share</button>
            <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  )
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div data-testid="step-indicator" className="flex gap-2 justify-center mt-2">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className="step-dot"
          data-testid={`step-dot-${n}`}
          data-active={String(n === currentStep)}
        />
      ))}
    </div>
  )
}
