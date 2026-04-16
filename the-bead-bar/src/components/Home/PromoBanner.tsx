'use client'

import { useState, useEffect } from 'react'
import type { Banner } from '@/lib/banners/banners'

interface PromoBannerProps {
  banner: Banner
}

const COLOR_CLASSES: Record<Banner['bgColor'], string> = {
  sage:  'bg-[var(--sage)]      text-white',
  gold:  'bg-[var(--gold)]      text-white',
  cream: 'bg-[var(--cream-dark)] text-[var(--text-dark)]',
}

export function PromoBanner({ banner }: PromoBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const key = `dismissed-banner-${banner.id}`
    if (!localStorage.getItem(key)) {
      setVisible(true)
    }
  }, [banner.id])

  function dismiss() {
    localStorage.setItem(`dismissed-banner-${banner.id}`, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <section
      role="banner"
      aria-label="Promotional banner"
      className={`w-full text-sm py-2 px-4 flex items-center justify-center gap-3 ${COLOR_CLASSES[banner.bgColor]}`}
    >
      <span>{banner.message}</span>

      {banner.ctaUrl && banner.ctaLabel && (
        <a
          href={banner.ctaUrl}
          className="shrink-0 rounded-full border border-current px-3 py-0.5 text-xs font-semibold hover:opacity-80 transition-opacity"
        >
          {banner.ctaLabel}
        </a>
      )}

      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="ml-auto shrink-0 text-lg leading-none hover:opacity-70 transition-opacity"
      >
        &times;
      </button>
    </section>
  )
}
