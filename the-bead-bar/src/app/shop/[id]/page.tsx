import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products/catalog'
import { ProductDetailPage } from '@/components/Shop/ProductDetailPage'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()
  return <ProductDetailPage product={product} />
}
