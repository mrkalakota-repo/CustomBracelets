import dynamic from 'next/dynamic'

const BuilderClient = dynamic(
  () => import('@/components/Builder/BuilderClient').then(m => ({ default: m.BuilderClient })),
  { loading: () => <div className="page-container py-8 text-center text-text-mid">Loading builder…</div> }
)

export default function BuilderPage({
  searchParams,
}: {
  searchParams: { mode?: string }
}) {
  const isBff = searchParams.mode === 'bff'
  return (
    <main>
      <BuilderClient isBff={isBff} />
    </main>
  )
}
