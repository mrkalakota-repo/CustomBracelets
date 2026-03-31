'use client'

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

/** Returns a human-readable label for a given id */
function toLabel(id: string): string {
  return DISPLAY_LABELS[id] ??
    id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function ShareCard({ selection, brandUrl, onShare }: ShareCardProps) {
  const { baseStyle, primaryColor, accentPattern, addOns } = selection
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

  function handleDownload() {
    // Placeholder: in production this triggers html2canvas capture
    const link = document.createElement('a')
    link.download = 'my-bracelet.png'
    link.click()
  }

  return (
    <div data-testid="share-card" className="card p-5 flex flex-col gap-4 max-w-xs mx-auto">
      {/* Preview area — in production rendered via html2canvas */}
      <div
        data-testid="card-preview"
        aria-label="Bracelet preview"
        className="w-full aspect-square rounded-xl bg-cream-dark flex items-center justify-center"
      />

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
