'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import type { Product } from '@/lib/products/catalog'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: number, name: string) {
    if (!session) return
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    setDeleting(id)
    setError(null)

    const res = await fetch(`/api/admin/products/${id}`, {
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

  if (products.length === 0) {
    return <p className="text-text-mid py-8 text-center">No products yet. Add one to get started.</p>
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
              <th className="py-3 pr-4 font-medium">Type</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4 font-mono text-text-mid text-xs">{p.id}</td>
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4 capitalize text-text-mid">{p.type}</td>
                <td className="py-3 pr-4 text-sage font-semibold">${p.price}</td>
                <td className="py-3 flex gap-4">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-sage hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deleting === p.id}
                    className="text-red-500 hover:underline disabled:opacity-40"
                  >
                    {deleting === p.id ? 'Deleting…' : 'Delete'}
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
