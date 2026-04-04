'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id:       string
  name:     string
  type:     string
  price:    number
  imageUrl: string
  occasion: string
}

interface ShopPageProps {
  products:     Product[]
  initialType?: string
}

const TYPE_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'beaded',    label: 'Beaded' },
  { id: 'cord',      label: 'Cord' },
  { id: 'chain',     label: 'Chain' },
  { id: 'charm',     label: 'Charm' },
  { id: 'stackable', label: 'Stackable' },
]

export function ShopPage({ products, initialType }: ShopPageProps) {
  const [activeType, setActiveType] = useState(initialType ?? 'all')

  const filtered = activeType === 'all'
    ? products
    : products.filter(p => p.type === activeType)

  return (
    <div data-testid="shop-page" className="page-container py-8">
      <h1 className="mb-6">Shop</h1>

      {/* Filters */}
      <div data-testid="filters" className="flex flex-wrap gap-2 mb-6">
        {TYPE_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            className="filter-btn"
            data-active={String(activeType === id)}
            onClick={() => setActiveType(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div data-testid="empty-state" className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-text-mid">No bracelets found for this filter.</p>
          <button className="btn-secondary" onClick={() => setActiveType('all')}>Clear filter</button>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(p => (
            <Link key={p.id} href={`/shop/${p.id}`} className="card block">
              <div data-testid="product-card">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-text-dark truncate">{p.name}</p>
                  <p className="text-sage font-semibold text-sm">${p.price}</p>
                </div>
              </div>
            </Link>

          ))}
        </div>
      )}
    </div>
  )
}
