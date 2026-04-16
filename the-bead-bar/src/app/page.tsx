import { HomePage } from '@/components/Home/HomePage'
import { getAllProducts, FEATURED_PRODUCT_IDS } from '@/lib/products/catalog'
import { getAllDrops } from '@/lib/drops/registry'
import { getDropState, DropState } from '@/lib/drops/state'
import { getActiveBanner } from '@/lib/banners/banners'

export default async function Home() {
  const [allProducts, allDrops, activeBanner] = await Promise.all([getAllProducts(), getAllDrops(), getActiveBanner()])

  const featuredProducts = allProducts.filter(p => FEATURED_PRODUCT_IDS.includes(p.id))

  const activeDrop = allDrops
    .map(d => ({ ...d, state: getDropState(d.launchDate, d.stock) }))
    .find(d => d.state === DropState.UPCOMING || d.state === DropState.LIVE)

  return <HomePage featuredProducts={featuredProducts} activeDrop={activeDrop} activeBanner={activeBanner ?? undefined} />
}
