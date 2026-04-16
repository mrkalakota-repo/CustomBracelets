import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products/catalog'
import { ProductDetailPage } from '@/components/Shop/ProductDetailPage'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return {}
  return {
    title:       `${product.name} — Chic Charm Co.`,
    description: product.description,
    openGraph: {
      title:       `${product.name} — Chic Charm Co.`,
      description: product.description,
      images:      [{ url: product.imageUrl, width: 800, height: 800, alt: product.name }],
      type:        'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${product.name} — Chic Charm Co.`,
      description: product.description,
      images:      [product.imageUrl],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  return <ProductDetailPage product={product} />
}
