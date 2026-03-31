import { HomePage } from '@/components/Home/HomePage'
import { ALL_PRODUCTS, FEATURED_PRODUCT_IDS } from '@/lib/products/catalog'

const featuredProducts = ALL_PRODUCTS.filter(p => FEATURED_PRODUCT_IDS.includes(p.id))

export default function Home() {
  return <HomePage featuredProducts={featuredProducts} />
}
