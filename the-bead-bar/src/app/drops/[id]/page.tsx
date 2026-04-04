import { DropRoute } from '@/components/DropPage/DropRoute'
import { getDropById } from '@/lib/drops/registry'

export default async function DropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drop = getDropById(id) ?? null
  return <DropRoute drop={drop} />
}
