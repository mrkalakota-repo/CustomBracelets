import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products/catalog'
import { ProductForm } from '@/components/Admin/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
      <ProductForm initialProduct={product} />
    </section>
  )
}
