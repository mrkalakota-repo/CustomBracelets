'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import type { Drop } from '@/lib/drops/registry'

interface DropsTableProps {
  drops: Drop[]
}

export function DropsTable({ drops }: DropsTableProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!session) return
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    setDeleting(id)
    setError(null)

    const res = await fetch(`/api/admin/drops/${id}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    setDeleting(null)

    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Delete failed')
      return
    }

    router.refresh()
  }

  if (drops.length === 0) {
    return <p className="text-text-mid py-8 text-center">No drops yet. Add one to get started.</p>
  }

  return (
    <div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-text-mid">
              <th className="py-3 pr-4 font-medium">ID</th>
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="py-3 pr-4 font-medium">Theme</th>
              <th className="py-3 pr-4 font-medium">Launch Date</th>
              <th className="py-3 pr-4 font-medium">Stock</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drops.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-mono text-text-mid text-xs">{d.id}</td>
                <td className="py-3 pr-4 font-medium">{d.name}</td>
                <td className="py-3 pr-4 text-text-mid">{d.theme}</td>
                <td className="py-3 pr-4 text-text-mid">
                  {d.launchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="py-3 pr-4">{d.stock}</td>
                <td className="py-3 flex gap-4">
                  <Link
                    href={`/admin/drops/${d.id}/edit`}
                    className="text-sage hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(d.id, d.name)}
                    disabled={deleting === d.id}
                    className="text-red-500 hover:underline disabled:opacity-40"
                  >
                    {deleting === d.id ? 'Deleting…' : 'Delete'}
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
