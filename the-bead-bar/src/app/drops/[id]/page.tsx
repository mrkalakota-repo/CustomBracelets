import { DropRoute } from '@/components/DropPage/DropRoute'
import { getDropById } from '@/lib/drops/registry'

export default function DropPage({ params }: { params: { id: string } }) {
  const drop = getDropById(params.id) ?? null
  return <DropRoute drop={drop} />
}
