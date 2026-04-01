'use client'

import { useRef } from 'react'
import type { BaseStyle } from '@/lib/builder/compatibility'

interface ShareCardSelection {
  baseStyle:      BaseStyle
  primaryColor:   string
  accentPattern:  string | null
  addOns: {
    charm?: string
    text?:  string
  }
}

interface ShareCardProps {
  selection: ShareCardSelection
  brandUrl:  string
  onShare?:  () => void
}

/** Display labels for all color and pattern ids */
const DISPLAY_LABELS: Record<string, string> = {
  // Colors
  'sage-green':  'Sage Green',
  'cream':       'Cream',
  'soft-gold':   'Soft Gold',
  'dusty-rose':  'Dusty Rose',
  'off-white':   'Off White',
  'dip-dye':     'Dip-Dye',
  // Patterns
  'solid':       'Solid',
  'two-tone':    'Two-Tone',
  'gradient':    'Gradient',
  'checker':     'Checker',
  'stripe':      'Stripe',
  'knotted':     'Knotted',
  'braided':     'Braided',
  'plain':       'Plain',
  'twisted':     'Twisted',
  // Base styles
  'beaded':      'Beaded',
  'cord':        'Cord',
  'chain':       'Chain',
  'charm':       'Charm',
  'stackable':   'Stackable',
  // Charms
  'star':        'Star',
  'heart':       'Heart',
  'moon':        'Moon',
  'flower':      'Flower',
}

/** Color values for the preview swatch */
const COLOR_HEX: Record<string, string> = {
  'sage-green':  '#8FAF8A',
  'cream':       '#F5F0E8',
  'soft-gold':   '#C9A96E',
  'dusty-rose':  '#D4A5A5',
  'off-white':   '#F8F6F0',
  'dip-dye':     'linear-gradient(135deg, #8FAF8A 0%, #C9A96E 100%)',
}

/** Returns a human-readable label for a given id */
function toLabel(id: string): string {
  return DISPLAY_LABELS[id] ??
    id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function ShareCard({ selection, brandUrl, onShare }: ShareCardProps) {
  const { baseStyle, primaryColor, accentPattern, addOns } = selection
  const previewRef = useRef<HTMLDivElement>(null)
  const hasWebShare = typeof navigator !== 'undefined' && !!navigator.share

  function handleShare() {
    onShare?.()
    if (hasWebShare) {
      navigator.share({
        title: `My custom bracelet from ${brandUrl}`,
        text:  `I just designed a ${toLabel(baseStyle)} bracelet — check it out!`,
        url:   `https://${brandUrl}`,
      })
    }
  }

  async function handleDownload() {
    if (!previewRef.current) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#F5F0E8',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = 'my-bracelet.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('[ShareCard] download failed:', err)
    }
  }

  const colorValue = COLOR_HEX[primaryColor] ?? '#E5E0D8'
  const isGradient = colorValue.startsWith('linear-gradient')

  return (
    <div data-testid="share-card" className="card p-5 flex flex-col gap-4 max-w-xs mx-auto">
      {/* Preview area — captured by html2canvas on download */}
      <div
        ref={previewRef}
        data-testid="card-preview"
        aria-label="Bracelet preview"
        className="w-full aspect-square rounded-xl bg-cream-dark flex flex-col items-center justify-center gap-3 p-4"
      >
        {/* Color swatch circle */}
        <div
          className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          style={{ background: colorValue, ...(isGradient ? {} : {}) }}
        />

        {/* Brand name */}
        <p className="text-xs font-semibold tracking-widest uppercase text-text-mid">
          The Bead Bar
        </p>

        {/* Design summary */}
        <div className="text-center">
          <p className="font-bold text-text-dark text-sm">{toLabel(baseStyle)}</p>
          <p className="text-text-mid text-xs">{toLabel(primaryColor)}</p>
          {accentPattern && (
            <p className="text-text-light text-xs">{toLabel(accentPattern)}</p>
          )}
          {addOns.text && (
            <p className="text-text-mid text-xs italic mt-1">&ldquo;{addOns.text}&rdquo;</p>
          )}
        </div>
      </div>

      {/* Bracelet details */}
      <div className="flex flex-col gap-1 text-sm">
        <p data-testid="card-bracelet-type" className="font-semibold text-base">{toLabel(baseStyle)}</p>
        <p data-testid="card-color" className="text-text-mid">{toLabel(primaryColor)}</p>

        {accentPattern && (
          <p data-testid="card-pattern" className="text-text-mid">{toLabel(accentPattern)}</p>
        )}

        {addOns.charm && (
          <p data-testid="card-charm" className="text-text-mid">Charm: {toLabel(addOns.charm)}</p>
        )}

        {addOns.text && (
          <p data-testid="card-text" className="text-text-mid italic">&ldquo;{addOns.text}&rdquo;</p>
        )}
      </div>

      <p data-testid="card-brand-url" className="text-xs text-text-light">{brandUrl}</p>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn-primary flex-1" onClick={handleShare}>Share</button>
        {!hasWebShare && (
          <button className="btn-secondary flex-1" onClick={handleDownload}>Download</button>
        )}
      </div>
    </div>
  )
}
