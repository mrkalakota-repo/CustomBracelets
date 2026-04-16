import { notFound } from 'next/navigation'
import { getDropById } from '@/lib/drops/registry'
import { DropForm } from '@/components/Admin/DropForm'

export default async function EditDropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drop = await getDropById(id)
  if (!drop) notFound()

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Edit Drop</h2>
      <DropForm initialDrop={drop} />
    </section>
  )
}
