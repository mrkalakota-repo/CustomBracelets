import Link from 'next/link'
import { getAllProducts } from '@/lib/products/catalog'
import { ProductsTable } from '@/components/Admin/ProductsTable'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link href="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>
      <ProductsTable products={products} />
    </section>
  )
}
