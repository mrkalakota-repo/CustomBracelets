import { ShopPage } from '@/components/Shop/ShopPage'
import { getAllProducts } from '@/lib/products/catalog'

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const [products, { type }] = await Promise.all([getAllProducts(), searchParams])
  return <ShopPage products={products} initialType={type} />
}
