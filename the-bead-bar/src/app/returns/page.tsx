import Link from 'next/link'

export default function Returns() {
  return (
    <div className="page-container py-10 max-w-2xl mx-auto flex flex-col gap-6 text-sm text-text-mid leading-relaxed">
      <Link href="/" className="text-text-mid hover:text-text-dark transition-colors">← Home</Link>
      <h1 className="text-text-dark">Returns &amp; Exchanges</h1>
      <p>
        We want you to love your bracelet. If something isn&apos;t right, we&apos;re here to help.
      </p>
      <h2 className="text-text-dark text-base font-semibold">Our policy</h2>
      <ul className="list-disc pl-5 flex flex-col gap-2">
        <li><span className="text-text-dark font-medium">14 days</span> from delivery to request a return or exchange.</li>
        <li>Items must be unworn and in original condition.</li>
        <li>Custom-engraved or personalized items are final sale.</li>
        <li>BFF sets can only be returned as a complete set.</li>
      </ul>
      <h2 className="text-text-dark text-base font-semibold">How to start a return</h2>
      <p>
        Email <span className="text-text-dark font-medium">hello@thebeadbar.com</span> with your order
        number and reason for return. We&apos;ll send a prepaid return label within one business day.
        Refunds are issued to your original payment method within 5–7 business days of receiving the item.
      </p>
    </div>
  )
}
