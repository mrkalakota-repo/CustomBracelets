import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products/catalog'
import { ProductDetailPage } from '@/components/Shop/ProductDetailPage'

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)
  if (!product) notFound()
  return <ProductDetailPage product={product} />
}
