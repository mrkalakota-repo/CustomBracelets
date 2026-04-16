'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Product } from '@/lib/products/catalog'

interface ProductFormProps {
  initialProduct?: Product
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter()
  const { session } = useAuth()
  const isEdit = !!initialProduct

  const [fields, setFields] = useState({
    id:          initialProduct?.id          ?? '',
    name:        initialProduct?.name        ?? '',
    type:        initialProduct?.type        ?? 'beaded',
    price:       String(initialProduct?.price ?? ''),
    imageUrl:    initialProduct?.imageUrl    ?? '',
    occasion:    initialProduct?.occasion    ?? '',
    description: initialProduct?.description ?? '',
  })
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return

    const price = parseFloat(fields.price)
    if (isNaN(price) || price < 0) {
      setError('Price must be a non-negative number')
      return
    }

    setLoading(true)
    setError(null)

    const url    = isEdit ? `/api/admin/products/${initialProduct!.id}` : '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...fields, price }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Request failed')
      setLoading(false)
      return
    }

    router.push('/admin/products')
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
            placeholder="e.g. sage-beaded-v2"
          />
          <p className="text-xs text-text-mid mt-1">Used in URLs — lowercase, hyphens only, no spaces.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="input w-full" name="name" value={fields.name} onChange={onChange} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select className="input w-full" name="type" value={fields.type} onChange={onChange}>
          <option value="beaded">Beaded</option>
          <option value="string">String</option>
          <option value="chain">Chain</option>
          <option value="stackable">Stackable</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input
          className="input w-full"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={fields.price}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image path</label>
        <input
          className="input w-full"
          name="imageUrl"
          value={fields.imageUrl}
          onChange={onChange}
          placeholder="/images/my-bracelet.svg"
        />
        <p className="text-xs text-text-mid mt-1">Path relative to /public — e.g. /images/sage-beaded.svg</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Occasion</label>
        <input
          className="input w-full"
          name="occasion"
          value={fields.occasion}
          onChange={onChange}
          placeholder="everyday, gift, valentines…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="input w-full"
          name="description"
          value={fields.description}
          onChange={onChange}
          rows={3}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  )
}
