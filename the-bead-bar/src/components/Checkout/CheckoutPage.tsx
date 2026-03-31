'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AgeGateForm } from '@/components/AgeGateForm/AgeGateForm'
import {
  cartTotal, shippingCost, orderTotal,
  FREE_SHIPPING_THRESHOLD, SHIPPING_COST,
} from '@/lib/cart/cartTypes'
import type { CartItem } from '@/lib/cart/cartTypes'

interface CheckoutPageProps {
  items:           CartItem[]
  paymentSection?: React.ReactNode
  onPayNow?:       () => void
  onAfterpay?:     () => void
  onKlarna?:       () => void
}

export function CheckoutPage({ items, paymentSection, onPayNow, onAfterpay, onKlarna }: CheckoutPageProps) {
  const [bnplAgeConfirmed, setBnplAgeConfirmed] = useState(false)

  const subtotal = cartTotal(items)
  const shipping = shippingCost(subtotal)
  const total    = orderTotal(items)
  const needsMore = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div data-testid="checkout-page" className="page-container py-8 flex flex-col gap-6">
      <h1>Checkout</h1>

      {items.length === 0 ? (
        <div data-testid="empty-cart" className="text-center py-16">
          <p className="text-text-mid">Your cart is empty.</p>
        </div>
      ) : (
        <>
          {/* Cart Summary */}
          <section className="card p-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold">Your Order</h2>
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-mid">Subtotal</span>
                <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-mid">Shipping</span>
                <span data-testid="shipping" className={shipping === 0 ? 'text-sage font-medium' : ''}>
                  {shipping === 0 ? 'Free' : `$${SHIPPING_COST.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span data-testid="order-total">${total.toFixed(2)}</span>
              </div>
              {needsMore > 0 && (
                <p data-testid="free-shipping-nudge" className="text-xs text-sage font-medium text-center mt-1">
                  Add ${needsMore.toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </section>

          {/* Checkout Form */}
          <section data-testid="checkout-form" className="card p-5 flex flex-col gap-5">
            {/* Payment section — real Stripe Elements in production, prop-injectable for tests */}
            {paymentSection ?? (
              <>
                <div data-testid="express-checkout" className="flex flex-col gap-2">
                  <p className="text-xs text-text-light uppercase tracking-wider font-medium">Fast checkout</p>
                  <div id="express-checkout-element" />
                </div>
                <div className="flex items-center gap-3">
                  <hr className="flex-1 border-border" />
                  <span className="text-xs text-text-light">or pay by card</span>
                  <hr className="flex-1 border-border" />
                </div>
                <div id="payment-element" />
                <button className="btn-primary w-full" onClick={onPayNow}>Pay Now</button>
              </>
            )}

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-border" />
              <span className="text-xs text-text-light">buy now pay later</span>
              <hr className="flex-1 border-border" />
            </div>

            {/* BNPL section */}
            <div data-testid="bnpl-section" className="flex flex-col gap-3">
              <p className="text-sm text-text-mid">Buy Now, Pay Later (18+ only)</p>
              <AgeGateForm
                checked={bnplAgeConfirmed}
                onChange={setBnplAgeConfirmed}
                minAge={18}
                showBnplNote
              />
              {bnplAgeConfirmed && (
                <div className="flex gap-3">
                  <button className="btn-secondary flex-1" onClick={onAfterpay}>Afterpay</button>
                  <button className="btn-secondary flex-1" onClick={onKlarna}>Klarna</button>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div data-testid="cart-item" className="flex gap-3">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-sm text-text-mid">${(item.price).toFixed(2)}</p>
        <p className="text-xs text-text-light" data-testid={`item-qty-${item.id}`}>Qty: {item.quantity}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {item.addOns.giftWrap && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Gift Wrap</span>}
          {item.addOns.charm    && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Charm: {item.addOns.charm}</span>}
          {item.addOns.text     && <span className="text-xs bg-sage-light text-text-dark px-2 py-0.5 rounded-full">Text: {item.addOns.text}</span>}
          {item.addOns.rush     && <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">Rush Order</span>}
        </div>
      </div>
    </div>
  )
}
