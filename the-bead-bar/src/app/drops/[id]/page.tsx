import type { Metadata } from 'next'
import { DropRoute } from '@/components/DropPage/DropRoute'
import { getDropById } from '@/lib/drops/registry'
import { getProductById, type Product } from '@/lib/products/catalog'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const drop = await getDropById(id)
  if (!drop) return {}
  const title       = `${drop.name} Drop — Chic Charm Co.`
  const description = `${drop.theme} · Limited release on ${new Date(drop.launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: drop.previewImageUrl ? [{ url: drop.previewImageUrl, width: 800, height: 800, alt: drop.name }] : [],
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      ...(drop.previewImageUrl ? { images: [drop.previewImageUrl] } : {}),
    },
  }
}

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drop = (await getDropById(id)) ?? null

  const products: Product[] = drop?.productIds?.length
    ? (await Promise.all(drop.productIds.map(pid => getProductById(pid)))).filter((p): p is Product => p !== undefined)
    : []

  return <DropRoute drop={drop} products={products} />
}
