'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class CartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[CartErrorBoundary]', error)
    // Clear corrupted cart data so the app recovers on next reload
    try { localStorage.removeItem('chic-charm-cart') } catch { /* ignore */ }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white border border-border rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3">
          <span>🛒</span>
          <p className="text-sm text-text-mid">
            Your cart had an issue and was reset.{' '}
            <button
              className="text-sage font-medium underline"
              onClick={() => this.setState({ hasError: false })}
            >
              Dismiss
            </button>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
