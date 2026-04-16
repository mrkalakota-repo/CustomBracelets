import Link from 'next/link'
import { getAllDrops } from '@/lib/drops/registry'
import { DropsTable } from '@/components/Admin/DropsTable'

export default async function AdminDropsPage() {
  const drops = await getAllDrops()

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Drops</h2>
        <Link href="/admin/drops/new" className="btn-primary">
          Add Drop
        </Link>
      </div>
      <DropsTable drops={drops} />
    </section>
  )
}
