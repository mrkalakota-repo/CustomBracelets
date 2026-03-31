import { ShopPage } from '@/components/Shop/ShopPage'
import { ALL_PRODUCTS } from '@/lib/products/catalog'

export default function Shop({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  return <ShopPage products={ALL_PRODUCTS} initialType={searchParams.type} />
}
