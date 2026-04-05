import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStripe } from '@stripe/stripe-react-native'
import { useCartStore } from '../src/store/cart'
import { Button } from '../src/components/ui/Button'
import type { BaseStyle } from '../src/lib/builder/compatibility'

// The app calls the website's API routes directly (see CLAUDE.md)
const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'

// Map catalog product types → BaseStyle for the checkout API.
// 'stackable' isn't a builder base style; fall back to 'beaded'.
const PRODUCT_TYPE_TO_BASE: Record<string, BaseStyle> = {
  beaded:    'beaded',
  cord:      'cord',
  chain:     'chain',
  charm:     'charm',
  stackable: 'beaded',
}

// ── Age Gate ─────────────────────────────────────────────────────────────────

function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [checked, setChecked] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">Checkout</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-5xl mb-4">📿</Text>
        <Text className="text-gray-800 text-xl font-bold text-center mb-2">Before you check out</Text>
        <Text className="text-gray-400 text-sm text-center mb-8">
          Chic Charm Co. is designed for teens 13 and up. Please confirm your age to continue.
        </Text>

        <TouchableOpacity
          onPress={() => setChecked(!checked)}
          className="flex-row items-center gap-3 mb-8"
        >
          <View className={`w-6 h-6 rounded border-2 items-center justify-center ${checked ? 'bg-sage border-sage' : 'border-gray-300'}`}>
            {checked && <Text className="text-white text-sm font-bold">✓</Text>}
          </View>
          <Text className="text-gray-700 text-base flex-1">I confirm I am 13 or older</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { if (checked) onConfirm() }}
          className={`w-full rounded-full py-4 items-center ${checked ? 'bg-sage' : 'bg-gray-200'}`}
        >
          <Text className={`font-bold text-base ${checked ? 'text-white' : 'text-gray-400'}`}>
            Continue to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// ── Main Checkout ─────────────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const { items, total } = useCartStore()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  const cartTotal    = total()
  const freeShipping = cartTotal >= 20
  const shippingCost = freeShipping ? 0 : 3.99
  const grandTotal   = cartTotal + shippingCost

  const [ageGatePassed, setAgeGatePassed] = useState(false)
  const [paymentReady, setPaymentReady]   = useState(false)
  const [loading, setLoading]             = useState(false)
  const [initError, setInitError]         = useState<string | null>(null)

  // Fetch PaymentIntent from the web API and initialize the PaymentSheet
  const initializePayment = useCallback(async () => {
    if (items.length === 0) return
    setLoading(true)
    setInitError(null)

    try {
      const apiItems = items.map(item => ({
        id:        item.id,
        baseStyle: item.isCustom
          ? (item.baseStyle ?? 'beaded')
          : PRODUCT_TYPE_TO_BASE[item.product?.type ?? 'beaded'] ?? 'beaded',
        quantity: item.quantity,
        addOns:   item.addOns ?? {},
      }))

      const res = await fetch(`${API_BASE}/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: apiItems }),
      })

      if (!res.ok) {
        const { error } = await res.json() as { error: string }
        throw new Error(error ?? 'Payment setup failed')
      }

      const { clientSecret } = await res.json() as { clientSecret: string }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName:       'Chic Charm Co.',
        applePay:   { merchantCountryCode: 'US' },
        googlePay:  { merchantCountryCode: 'US', testEnv: !process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live') },
        returnURL:  'chiccharmco://checkout',
        style:      'alwaysLight',
      })

      if (error) throw new Error(error.message)
      setPaymentReady(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setInitError(msg)
    } finally {
      setLoading(false)
    }
  }, [items, initPaymentSheet])

  useEffect(() => {
    if (ageGatePassed) initializePayment()
  }, [ageGatePassed, initializePayment])

  async function handlePay() {
    if (!paymentReady) return
    setLoading(true)
    const { error } = await presentPaymentSheet()
    setLoading(false)

    if (error) {
      if (error.code === 'Canceled') {
        // User dismissed the sheet — the PaymentIntent is consumed. Reset so a
        // fresh intent is created before the next attempt.
        setPaymentReady(false)
        initializePayment()
      } else {
        Alert.alert('Payment failed', error.message)
      }
      return
    }

    // Do NOT clearCart() here. The cart is cleared on the order-confirmation
    // screen so that if something goes wrong before the user lands there
    // (crash, nav failure) the cart is still intact and recoverable.
    router.replace('/order-confirmation')
  }

  // ── Age gate must come first ────────────────────────────────────────────────
  if (!ageGatePassed) {
    return <AgeGate onConfirm={() => setAgeGatePassed(true)} />
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">Checkout</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}>

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="font-semibold text-gray-800 mb-3">Order Summary</Text>
          {items.map(item => (
            <View key={item.id} className="flex-row justify-between mb-1">
              <Text className="text-gray-500 text-sm flex-1 mr-2" numberOfLines={1}>
                {item.isCustom ? 'Custom Bracelet' : (item.product?.name ?? 'Bracelet')}
                {item.quantity > 1 ? ` ×${item.quantity}` : ''}
              </Text>
              <Text className="text-gray-700 text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-cream mt-2 pt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 text-sm">Shipping</Text>
              <Text className={`text-sm font-medium ${freeShipping ? 'text-sage-dark' : 'text-gray-700'}`}>
                {freeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </Text>
            </View>
            {!freeShipping && (
              <Text className="text-sage text-xs mb-1">
                Add ${(20 - cartTotal).toFixed(2)} more for free shipping!
              </Text>
            )}
            <View className="flex-row justify-between border-t border-cream pt-2 mt-1">
              <Text className="text-gray-800 font-bold">Total</Text>
              <Text className="text-gray-800 font-bold">${grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment status */}
        {loading && (
          <View className="bg-white rounded-2xl p-6 mb-4 items-center shadow-sm">
            <ActivityIndicator color="#8FAF8A" />
            <Text className="text-gray-400 text-sm mt-3">Setting up payment…</Text>
          </View>
        )}

        {initError && (
          <View className="bg-red-50 rounded-2xl p-4 mb-4">
            <Text className="text-red-600 text-sm font-medium mb-1">Payment setup failed</Text>
            <Text className="text-red-400 text-xs mb-3">{initError}</Text>
            <TouchableOpacity onPress={initializePayment} className="bg-red-500 rounded-full py-2 items-center">
              <Text className="text-white text-sm font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {paymentReady && !loading && (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 text-sm font-semibold mb-1">Payment</Text>
            <Text className="text-gray-400 text-xs">Apple Pay · Google Pay · Card</Text>
            <Text className="text-gray-300 text-xs mt-1">Tap "Pay Now" below to open the secure payment sheet.</Text>
          </View>
        )}

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-dark px-5 pb-8 pt-4">
        <Button
          label={loading ? 'Setting up…' : `Pay Now — $${grandTotal.toFixed(2)}`}
          onPress={handlePay}
          loading={loading}
          disabled={!paymentReady || loading}
          fullWidth
        />
      </View>
    </SafeAreaView>
  )
}
