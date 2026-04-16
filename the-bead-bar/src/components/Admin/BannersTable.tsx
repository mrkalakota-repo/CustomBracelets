'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import type { Banner } from '@/lib/banners/banners'

type BannerRow = Banner & { isActive: boolean; createdAt: string }

interface BannersTableProps {
  banners: BannerRow[]
}

const COLOR_LABEL: Record<Banner['bgColor'], string> = {
  sage:  'Sage',
  gold:  'Gold',
  cream: 'Cream',
}

export function BannersTable({ banners }: BannersTableProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [pending, setPending] = useState<number | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  async function toggleActive(id: number, currentlyActive: boolean) {
    if (!session) return
    setPending(id)
    setError(null)

    const res = await fetch(`/api/admin/banners/${id}`, {
      method:  'PUT',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ isActive: !currentlyActive }),
    })

    setPending(null)

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Update failed')
      return
    }

    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!session) return
    if (!confirm('Delete this banner? This cannot be undone.')) return

    setPending(id)
    setError(null)

    const res = await fetch(`/api/admin/banners/${id}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    setPending(null)

    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Delete failed')
      return
    }

    router.refresh()
  }

  if (banners.length === 0) {
    return <p className="text-text-mid py-8 text-center">No banners yet. Add one to get started.</p>
  }

  return (
    <div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-text-mid">
              <th className="py-3 pr-4 font-medium">Message</th>
              <th className="py-3 pr-4 font-medium">CTA</th>
              <th className="py-3 pr-4 font-medium">Color</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 max-w-[200px] truncate font-medium">{b.message}</td>
                <td className="py-3 pr-4 text-text-mid text-xs">
                  {b.ctaLabel ? `${b.ctaLabel} → ${b.ctaUrl ?? ''}` : '—'}
                </td>
                <td className="py-3 pr-4 capitalize text-text-mid">{COLOR_LABEL[b.bgColor]}</td>
                <td className="py-3 pr-4">
                  {b.isActive
                    ? <span className="badge-live">Active</span>
                    : <span className="text-text-light text-xs">Inactive</span>}
                </td>
                <td className="py-3 flex gap-4 flex-wrap">
                  <Link href={`/admin/banners/${b.id}/edit`} className="text-sage hover:underline">
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleActive(b.id, b.isActive)}
                    disabled={pending === b.id}
                    className="text-text-mid hover:underline disabled:opacity-40"
                  >
                    {pending === b.id ? '…' : b.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={pending === b.id}
                    className="text-red-500 hover:underline disabled:opacity-40"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
