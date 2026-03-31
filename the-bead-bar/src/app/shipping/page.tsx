import Link from 'next/link'

export default function Shipping() {
  return (
    <div className="page-container py-10 max-w-2xl mx-auto flex flex-col gap-6 text-sm text-text-mid leading-relaxed">
      <Link href="/" className="text-text-mid hover:text-text-dark transition-colors">← Home</Link>
      <h1 className="text-text-dark">Shipping</h1>
      <h2 className="text-text-dark text-base font-semibold">Rates</h2>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li><span className="text-text-dark font-medium">Free shipping</span> on all orders over $20.</li>
        <li><span className="text-text-dark font-medium">$3.99</span> flat rate for orders under $20.</li>
        <li>Rush processing (+$5) ships within 1 business day.</li>
      </ul>
      <h2 className="text-text-dark text-base font-semibold">Delivery times</h2>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li>Standard: 5–7 business days (US).</li>
        <li>Rush: 2–3 business days (US).</li>
        <li>International: 10–18 business days. Duties and taxes are the customer&apos;s responsibility.</li>
      </ul>
      <h2 className="text-text-dark text-base font-semibold">Tracking</h2>
      <p>
        You&apos;ll receive a tracking number by email once your order ships. Drop orders ship within
        24 hours of the drop going live — stock is limited, so orders are fulfilled in the order received.
      </p>
    </div>
  )
}
