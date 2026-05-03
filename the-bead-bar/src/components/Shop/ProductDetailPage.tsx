'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/products/catalog'

interface ProductDetailPageProps {
  product: Product
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { addItem } = useCart()
  const router      = useRouter()

  function handleAddToCart() {
    addItem({
      id:        String(product.id),
      name:      product.name,
      baseStyle: product.type,
      price:     product.price,
      quantity:  1,
      addOns:    {},
      imageUrl:  product.imageUrl,
    })
    router.push('/checkout')
  }

  return (
    <div className="page-container py-8 flex flex-col gap-6 max-w-lg mx-auto">
      <Link href="/shop" className="text-sm text-text-mid hover:text-text-dark transition-colors">
        ← Back to Shop
      </Link>

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 512px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <span className="text-sage font-semibold text-lg shrink-0">${product.price}</span>
        </div>
        <p className="text-text-mid text-sm leading-relaxed">{product.description}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="btn-primary w-full" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <Link href="/builder" className="btn-secondary w-full text-center">
          Customize Yours in the Builder
        </Link>
      </div>
    </div>
  )
}
