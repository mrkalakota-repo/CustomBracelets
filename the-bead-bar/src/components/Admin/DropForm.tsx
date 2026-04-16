'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Drop } from '@/lib/drops/registry'

interface DropFormProps {
  initialDrop?: Drop
}

// Format a Date to the value expected by datetime-local input: "YYYY-MM-DDTHH:MM"
function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function DropForm({ initialDrop }: DropFormProps) {
  const router = useRouter()
  const { session } = useAuth()
  const isEdit = !!initialDrop

  const [fields, setFields] = useState({
    id:              initialDrop?.id              ?? '',
    name:            initialDrop?.name            ?? '',
    theme:           initialDrop?.theme           ?? '',
    launchDate:      initialDrop ? toDatetimeLocal(initialDrop.launchDate) : '',
    stock:           String(initialDrop?.stock    ?? '0'),
    previewImageUrl: initialDrop?.previewImageUrl ?? '',
    productIds:      (initialDrop?.productIds     ?? []).join(', '),
    socialCopy:      initialDrop?.socialCopy      ?? '',
  })
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return

    const stock = parseInt(fields.stock, 10)
    if (isNaN(stock) || stock < 0) {
      setError('Stock must be a non-negative integer')
      return
    }

    if (!fields.launchDate) {
      setError('Launch date is required')
      return
    }

    // datetime-local gives "YYYY-MM-DDTHH:MM" — append seconds and Z for UTC ISO 8601
    const launchDate = new Date(fields.launchDate + ':00Z').toISOString()
    const productIds = fields.productIds
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    setLoading(true)
    setError(null)

    const url    = isEdit ? `/api/admin/drops/${initialDrop!.id}` : '/api/admin/drops'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        id:              fields.id,
        name:            fields.name,
        theme:           fields.theme,
        launchDate,
        stock,
        previewImageUrl: fields.previewImageUrl,
        productIds,
        socialCopy:      fields.socialCopy,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Request failed')
      setLoading(false)
      return
    }

    router.push('/admin/drops')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-lg">
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium mb-1">ID</label>
          <input
            className="input w-full"
            name="id"
            value={fields.id}
            onChange={onChange}
            required
            placeholder="e.g. summer-glow-2026"
          />
          <p className="text-xs text-text-mid mt-1">Used in URLs — lowercase, hyphens only, no spaces.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="input w-full" name="name" value={fields.name} onChange={onChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <input
          className="input w-full"
          name="theme"
          value={fields.theme}
          onChange={onChange}
          placeholder="e.g. Pastel florals, friendship"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Launch Date &amp; Time (UTC)</label>
        <input
          className="input w-full"
          name="launchDate"
          type="datetime-local"
          value={fields.launchDate}
          onChange={onChange}
          required
        />
        <p className="text-xs text-text-mid mt-1">All times are treated as UTC.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          className="input w-full"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={fields.stock}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preview image path</label>
        <input
          className="input w-full"
          name="previewImageUrl"
          value={fields.previewImageUrl}
          onChange={onChange}
          placeholder="/images/drops/my-drop.svg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Product IDs</label>
        <input
          className="input w-full"
          name="productIds"
          value={fields.productIds}
          onChange={onChange}
          placeholder="1, 2, 5"
        />
        <p className="text-xs text-text-mid mt-1">Comma-separated product IDs to include in this drop.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Social copy</label>
        <textarea
          className="input w-full"
          name="socialCopy"
          value={fields.socialCopy}
          onChange={onChange}
          rows={2}
          placeholder="Short caption for social posts…"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create drop'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  )
}
