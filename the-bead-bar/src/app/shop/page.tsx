import { ShopPage } from '@/components/Shop/ShopPage'
import { ALL_PRODUCTS } from '@/lib/products/catalog'

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  return <ShopPage products={ALL_PRODUCTS} initialType={type} />
}
