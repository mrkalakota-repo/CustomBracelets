import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="page-container py-10 max-w-2xl mx-auto flex flex-col gap-6 text-sm text-text-mid leading-relaxed">
      <Link href="/" className="text-text-mid hover:text-text-dark transition-colors">← Home</Link>
      <h1 className="text-text-dark">Privacy Policy</h1>
      <p>Last updated: April 2026</p>
      <p>
        Chic Charm Co. collects only the information needed to process your order and send shipping updates.
        We do not sell or share your personal data with third parties outside of payment processing (Stripe)
        and email marketing (Klaviyo) — both of which process data on your behalf.
      </p>
      <h2 className="text-text-dark text-base font-semibold">Data we collect</h2>
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>Name and email address when you subscribe to drop notifications or place an order.</li>
        <li>Shipping address and payment details when you check out (payment details go directly to Stripe — we never see your card number).</li>
        <li>Basic analytics data (page views, referrer) to understand how the site is used.</li>
      </ul>
      <h2 className="text-text-dark text-base font-semibold">Your rights</h2>
      <p>
        You can request deletion of your data at any time by emailing us. Marketing emails include an
        unsubscribe link — use it anytime to opt out.
      </p>
      <p>Questions? Email <span className="text-text-dark font-medium">hello@chiccharmco.com</span></p>
    </div>
  )
}
