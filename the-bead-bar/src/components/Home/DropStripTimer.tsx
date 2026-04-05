'use client'

import { useState, useEffect } from 'react'

export function DropStripTimer({ launchDate }: { launchDate: Date }) {
  const [diff, setDiff] = useState(() => Math.max(0, launchDate.getTime() - Date.now()))

  useEffect(() => {
    if (diff === 0) return
    const id = setInterval(() => {
      const remaining = Math.max(0, launchDate.getTime() - Date.now())
      setDiff(remaining)
      if (remaining === 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [launchDate, diff])

  const totalSeconds = Math.floor(diff / 1000)
  const hours        = Math.floor(totalSeconds / 3600)
  const minutes      = Math.floor((totalSeconds % 3600) / 60)
  const seconds      = totalSeconds % 60

  return (
    <span data-testid="drop-strip-timer">
      {hours}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
    </span>
  )
}
