'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Banner } from '@/lib/banners/banners'

type BannerRow = Banner & { isActive: boolean }

interface BannerFormProps {
  initialBanner?: BannerRow
}

export function BannerForm({ initialBanner }: BannerFormProps) {
  const router = useRouter()
  const { session } = useAuth()
  const isEdit = !!initialBanner

  const [fields, setFields] = useState({
    message:  initialBanner?.message   ?? '',
    ctaLabel: initialBanner?.ctaLabel  ?? '',
    ctaUrl:   initialBanner?.ctaUrl    ?? '',
    bgColor:  initialBanner?.bgColor   ?? 'sage',
    isActive: initialBanner?.isActive  ?? false,
  })
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    setError(null)

    const url    = isEdit ? `/api/admin/banners/${initialBanner!.id}` : '/api/admin/banners'
    const method = isEdit ? 'PUT' : 'POST'

    const payload: Record<string, unknown> = {
      message:  fields.message,
      bgColor:  fields.bgColor,
      isActive: fields.isActive,
      ctaLabel: fields.ctaLabel || null,
      ctaUrl:   fields.ctaUrl   || null,
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Request failed')
      setLoading(false)
      return
    }

    router.push('/admin/banners')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          className="input w-full"
          name="message"
          value={fields.message}
          onChange={onChange}
          required
          rows={2}
          placeholder="Summer Sale — 20% off everything this weekend!"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CTA Label <span className="text-text-light font-normal">(optional)</span></label>
        <input
          className="input w-full"
          name="ctaLabel"
          value={fields.ctaLabel}
          onChange={onChange}
          placeholder="Shop Now"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CTA URL <span className="text-text-light font-normal">(optional)</span></label>
        <input
          className="input w-full"
          name="ctaUrl"
          value={fields.ctaUrl}
          onChange={onChange}
          placeholder="/shop"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Background color</label>
        <select className="input w-full" name="bgColor" value={fields.bgColor} onChange={onChange}>
          <option value="sage">Sage (green)</option>
          <option value="gold">Gold</option>
          <option value="cream">Cream</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isActive"
          type="checkbox"
          name="isActive"
          checked={fields.isActive}
          onChange={onChange}
          className="h-4 w-4 accent-[var(--sage)]"
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Active <span className="text-text-light font-normal">(activating this will deactivate any other active banner)</span>
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create banner'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  )
}
