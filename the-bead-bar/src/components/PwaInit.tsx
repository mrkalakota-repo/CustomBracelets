'use client'

import { useEffect } from 'react'

export function PwaInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(err => console.error('[PWA] SW registration failed:', err))
    }
  }, [])

  return null
}
