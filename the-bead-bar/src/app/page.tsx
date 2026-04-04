import { HomePage } from '@/components/Home/HomePage'
import { ALL_PRODUCTS, FEATURED_PRODUCT_IDS } from '@/lib/products/catalog'
import { DROP_REGISTRY } from '@/lib/drops/registry'
import { getDropState, DropState } from '@/lib/drops/state'

const featuredProducts = ALL_PRODUCTS.filter(p => FEATURED_PRODUCT_IDS.includes(p.id))

export default function Home() {
  const activeDrop = DROP_REGISTRY
    .map(d => ({ ...d, state: getDropState(d.launchDate, d.stock) }))
    .find(d => d.state === DropState.UPCOMING || d.state === DropState.LIVE)

  return <HomePage featuredProducts={featuredProducts} activeDrop={activeDrop} />
}
