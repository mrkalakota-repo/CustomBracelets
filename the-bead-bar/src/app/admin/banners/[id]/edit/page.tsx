import { notFound } from 'next/navigation'
import { BannerForm } from '@/components/Admin/BannerForm'
import { getAllBanners } from '@/lib/banners/banners'

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const banners = await getAllBanners()
  const banner  = banners.find(b => String(b.id) === id)

  if (!banner) notFound()

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Edit Banner</h1>
      <BannerForm initialBanner={banner} />
    </div>
  )
}
