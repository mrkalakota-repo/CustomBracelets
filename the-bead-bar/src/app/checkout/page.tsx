import dynamic from 'next/dynamic'

const CheckoutWrapper = dynamic(
  () => import('@/components/Checkout/CheckoutWrapper').then(m => ({ default: m.CheckoutWrapper })),
  { loading: () => <div className="page-container py-8 text-center text-text-mid">Loading checkout…</div> }
)

export default function Checkout() {
  return <CheckoutWrapper />
}
