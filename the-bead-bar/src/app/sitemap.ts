import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products/catalog'
import { getAllDrops } from '@/lib/drops/registry'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chiccharmco.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allProducts, allDrops] = await Promise.all([getAllProducts(), getAllDrops()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                     lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE_URL}/shop`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/drops`,          lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/builder`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/returns`,        lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/shipping`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const productRoutes: MetadataRoute.Sitemap = allProducts.map(p => ({
    url:             `${BASE_URL}/shop/${p.id}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  const dropRoutes: MetadataRoute.Sitemap = allDrops.map(d => ({
    url:             `${BASE_URL}/drops/${d.id}`,
    lastModified:    new Date(),
    changeFrequency: 'daily',
    priority:        0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...dropRoutes]
}
