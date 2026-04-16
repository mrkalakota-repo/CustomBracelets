import Link from 'next/link'
import { BannersTable } from '@/components/Admin/BannersTable'
import { getAllBanners } from '@/lib/banners/banners'

export default async function AdminBannersPage() {
  const banners = await getAllBanners()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Banners</h1>
        <Link href="/admin/banners/new" className="btn-primary text-sm">
          Add Banner
        </Link>
      </div>
      <BannersTable banners={banners} />
    </div>
  )
}
