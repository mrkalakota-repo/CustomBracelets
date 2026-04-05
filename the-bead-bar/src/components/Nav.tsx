'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export function Nav() {
  const { itemCount } = useCart()
  const { user }      = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-border">
      <div className="page-container flex items-center justify-between h-14">
        {/* Brand */}
        <Link href="/" className="font-semibold text-text-dark tracking-tight hover:text-sage transition-colors">
          Chic Charm Co.
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-5 text-sm text-text-mid">
          <Link href="/shop"    className="hover:text-text-dark transition-colors">Shop</Link>
          <Link href="/builder" className="hover:text-text-dark transition-colors">Builder</Link>
          <Link href="/drops/spring-bloom-2026" className="hover:text-text-dark transition-colors">Drops</Link>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Profile */}
          <Link
            href={user ? '/profile' : '/sign-in'}
            className="text-text-dark hover:text-sage transition-colors"
            aria-label={user ? 'Your profile' : 'Sign in'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative flex items-center gap-1.5 text-sm font-medium text-text-dark hover:text-sage transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sage text-white text-[10px] font-bold
                w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
