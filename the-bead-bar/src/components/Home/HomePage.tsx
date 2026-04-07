import Link from 'next/link'
import Image from 'next/image'
import { DropState } from '@/lib/drops/state'
import { DropStripTimer } from './DropStripTimer'

interface Product {
  id:       string
  name:     string
  type:     string
  price:    number
  imageUrl: string
}

interface ActiveDrop {
  id:              string
  name:            string
  launchDate:      Date
  state:           DropState
  previewImageUrl: string
}

interface HomePageProps {
  featuredProducts: Product[]
  activeDrop?:      ActiveDrop
}

const CATEGORIES = [
  { id: 'beaded',    label: 'Beaded',    emoji: '📿' },
  { id: 'cord',      label: 'Cord',      emoji: '🧵' },
  { id: 'chain',     label: 'Chain',     emoji: '⛓️'  },
  { id: 'charm',     label: 'Charm',     emoji: '✨' },
  { id: 'stackable', label: 'Stackable', emoji: '💫' },
]

export function HomePage({ featuredProducts, activeDrop }: HomePageProps) {
  return (
    <div>
      <Hero />
      {activeDrop && <DropStrip drop={activeDrop} />}
      <Categories />
      <FeaturedProducts products={featuredProducts.slice(0, 4)} />
      <BuilderCta />
      <BffBanner />
      <Footer />
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section data-testid="hero" className="bg-cream flex flex-col items-center justify-center text-center px-4 py-8 gap-6">
      <h1 data-testid="hero-headline" className="text-4xl font-semibold tracking-tight">Jewelry made for you.</h1>
      <p className="text-text-mid max-w-xs">Minimalist designs, seasonal drops, and BFF sets — starting at $10.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/shop" className="btn-primary">Shop Now</Link>
        <Link href="/builder" className="btn-secondary">Build Yours</Link>
      </div>
    </section>
  )
}

// ─── DROP STRIP ───────────────────────────────────────────────────────────────

function DropStrip({ drop }: { drop: ActiveDrop }) {
  return (
    <div data-testid="drop-strip" className="bg-sage text-white flex items-center justify-center gap-3 py-2 px-4 text-sm font-medium">
      <span className="font-semibold">{drop.name}</span>
      {drop.state === DropState.LIVE ? (
        <span className="badge-live">Live Now</span>
      ) : (
        <DropStripTimer launchDate={drop.launchDate} />
      )}
      <Link href={`/drops/${drop.id}`} className="underline underline-offset-2 hover:no-underline">See Drop →</Link>
    </div>
  )
}


// ─── CATEGORIES ───────────────────────────────────────────────────────────────

function Categories() {
  return (
    <section data-testid="categories" className="section page-container">
      <h2 className="text-center mb-6">Shop by Style</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {CATEGORIES.map(({ id, label, emoji }) => (
          <Link key={id} href={`/shop?type=${id}`} aria-label={label}
            className="flex flex-col items-center gap-1 bg-white rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-shadow min-w-[72px]">
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs font-medium text-[var(--text-dark)]">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────

function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section data-testid="featured" className="section page-container">
      <h2 className="text-center mb-6">Bestsellers</h2>
      <div className="grid-2">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} data-testid="product-card" className="card block">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <p className="font-medium text-sm text-text-dark truncate">{product.name}</p>
        <p className="text-sage font-semibold text-sm">${product.price}</p>
      </div>
    </Link>
  )
}

// ─── BUILDER CTA ──────────────────────────────────────────────────────────────

function BuilderCta() {
  return (
    <section data-testid="builder-cta" className="section bg-cream-dark text-center px-4 py-16">
      <div className="page-container flex flex-col items-center gap-4">
        <h2>Make It Yours</h2>
        <p className="text-text-mid max-w-xs">Choose your style, color, and pattern.</p>
        <Link href="/builder" className="btn-primary">Design Your Bracelet</Link>
      </div>
    </section>
  )
}

// ─── BFF BANNER ───────────────────────────────────────────────────────────────

function BffBanner() {
  return (
    <section data-testid="bff-banner" className="section bg-sage-light text-center px-4 py-14">
      <div className="page-container flex flex-col items-center gap-4">
        <h2 className="text-text-dark">For You &amp; Your Bestie</h2>
        <Link href="/builder?mode=bff" className="btn-secondary">Match With Your Bestie</Link>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-border py-8 px-4">
      <div className="page-container flex flex-col items-center gap-4 text-sm text-text-mid">
        <nav className="flex flex-wrap gap-4 justify-center">
          <Link href="/privacy-policy" className="hover:text-text-dark transition-colors">Privacy Policy</Link>
          <Link href="/returns" className="hover:text-text-dark transition-colors">Returns</Link>
          <Link href="/shipping" className="hover:text-text-dark transition-colors">Shipping</Link>
        </nav>
        <nav aria-label="Social media" className="flex gap-4 justify-center">
          <Link href="https://tiktok.com" aria-label="TikTok" className="hover:text-text-dark transition-colors">TikTok</Link>
          <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-text-dark transition-colors">Instagram</Link>
          <Link href="https://pinterest.com" aria-label="Pinterest" className="hover:text-text-dark transition-colors">Pinterest</Link>
        </nav>
        <p className="text-xs text-text-light">&copy; {new Date().getFullYear()} Chic Charm Co.</p>
      </div>
    </footer>
  )
}
