import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="page-container py-10 max-w-2xl mx-auto flex flex-col gap-6 text-sm text-text-mid leading-relaxed">
      <Link href="/" className="text-text-mid hover:text-text-dark transition-colors">← Home</Link>
      <h1 className="text-text-dark">Terms of Service</h1>
      <p>Last updated: April 2026</p>

      <p>
        By placing an order or using Chic Charm Co. website, you agree to these terms. Please read them
        before purchasing.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Eligibility</h2>
      <p>
        You must be at least 13 years old to use this site. By completing a purchase you confirm you
        meet this requirement.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Orders &amp; Pricing</h2>
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>All prices are in USD and include applicable taxes where required by law.</li>
        <li>We reserve the right to cancel any order if a pricing error occurs; you will receive a full refund.</li>
        <li>Custom and limited-edition drop items are final sale unless defective on arrival.</li>
      </ul>

      <h2 className="text-text-dark text-base font-semibold">Shipping</h2>
      <p>
        We ship within the US only. Estimated delivery times are provided at checkout and are not
        guaranteed. See our <Link href="/shipping" className="underline hover:text-text-dark">Shipping Policy</Link> for full details.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Returns &amp; Exchanges</h2>
      <p>
        We accept returns within 14 days of delivery for unworn items in original condition. Custom-engraved
        or personalized items are final sale. See our <Link href="/returns" className="underline hover:text-text-dark">Returns Policy</Link> for full details.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Intellectual Property</h2>
      <p>
        All designs, images, and content on this site are owned by Chic Charm Co.. You may not reproduce
        or distribute them without written permission.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Limitation of Liability</h2>
      <p>
        Chic Charm Co. is not liable for indirect, incidental, or consequential damages arising from your
        use of our products or website. Our total liability for any claim is limited to the amount you
        paid for the order in question.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Governing Law</h2>
      <p>
        These terms are governed by the laws of the United States. Any disputes will be resolved in the
        jurisdiction where Chic Charm Co. is registered.
      </p>

      <h2 className="text-text-dark text-base font-semibold">Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes are posted
        constitutes acceptance of the new terms.
      </p>

      <p>Questions? Email <span className="text-text-dark font-medium">hello@chiccharmco.com</span></p>
    </div>
  )
}
