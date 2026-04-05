'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import {
  cartTotal, shippingCost, orderTotal,
  FREE_SHIPPING_THRESHOLD, SHIPPING_COST,
} from '@/lib/cart/cartTypes'

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCart()

  const subtotal  = cartTotal(items)
  const shipping  = shippingCost(subtotal)
  const total     = orderTotal(items)
  const needsMore = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div data-testid="cart-page" className="page-container py-8 flex flex-col gap-6">
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <div data-testid="empty-cart" className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-text-mid">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <>
          {needsMore > 0 && (
            <p className="text-sm text-sage font-medium text-center bg-sage-light rounded-xl py-2 px-4">
              Add ${needsMore.toFixed(2)} more for free shipping!
            </p>
          )}
          {needsMore <= 0 && (
            <p className="text-sm text-sage font-medium text-center bg-sage-light rounded-xl py-2 px-4">
              🎉 You&apos;ve got free shipping!
            </p>
          )}

          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div key={item.id} data-testid="cart-item" className="card p-4 flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-text-dark truncate">{item.name}</p>
                  <p className="text-sage font-semibold text-sm mt-0.5">${item.price.toFixed(2)}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.addOns.giftWrap && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Gift Wrap</span>}
                    {item.addOns.charm    && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Charm: {item.addOns.charm}</span>}
                    {item.addOns.text     && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Text: {item.addOns.text}</span>}
                    {item.addOns.rush     && <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">Rush Order</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button
                        className="w-7 h-7 flex items-center justify-center text-text-mid hover:text-text-dark transition-colors"
                        onClick={() => {
                          if (item.quantity <= 1) removeItem(item.id)
                          else updateQuantity(item.id, item.quantity - 1)
                        }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center text-text-mid hover:text-text-dark transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs text-text-light hover:text-text-dark transition-colors"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-mid">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-mid">Shipping</span>
              <span className={shipping === 0 ? 'text-sage font-medium' : ''}>
                {shipping === 0 ? 'Free' : `$${SHIPPING_COST.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary text-center">
            Proceed to Checkout →
          </Link>
          <Link href="/shop" className="btn-secondary text-center">
            Continue Shopping
          </Link>
        </>
      )}
    </div>
  )
}
