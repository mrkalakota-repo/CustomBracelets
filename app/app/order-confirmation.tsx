import React, { useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../src/components/ui/Button'
import { useCartStore } from '../src/store/cart'
import { useLastOrderStore } from '../src/store/lastOrder'

export default function OrderConfirmationScreen() {
  const clearCart  = useCartStore(s => s.clearCart)
  const { items: orderItems, total: orderTotal, clear: clearOrder } = useLastOrderStore()

  // Clear cart here — after the user has successfully landed on this screen —
  // rather than in checkout.tsx immediately after presentPaymentSheet(). This
  // ensures the cart survives any crash or navigation failure between payment
  // confirmation and this screen.
  useEffect(() => {
    clearCart()
    return () => clearOrder()   // clean up snapshot when leaving screen
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Hero */}
        <View className="items-center pt-6 pb-4">
          <Text className="text-7xl mb-5">📦</Text>
          <Text className="text-gray-800 text-2xl font-bold text-center mb-2">Order Placed!</Text>
          <Text className="text-gray-500 text-base text-center mb-1">
            You'll receive a confirmation email shortly with tracking info.
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-6">
            Processing time: 1–3 business days
          </Text>
        </View>

        {/* Order summary — shown when cart snapshot is available */}
        {orderItems.length > 0 && (
          <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
            <Text className="text-gray-800 font-semibold text-base mb-3">Order Summary</Text>
            {orderItems.map(item => (
              <View key={item.id} className="flex-row justify-between items-center py-1.5 border-b border-cream last:border-0">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-700 text-sm font-medium" numberOfLines={1}>
                    {item.isCustom
                      ? `Custom ${item.baseStyle ?? ''} bracelet`.trim()
                      : (item.product?.name ?? 'Bracelet')}
                  </Text>
                  {item.quantity > 1 && (
                    <Text className="text-gray-400 text-xs">Qty: {item.quantity}</Text>
                  )}
                </View>
                <Text className="text-gray-700 text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="flex-row justify-between pt-3 mt-1">
              <Text className="text-gray-800 font-bold">Total</Text>
              <Text className="text-gray-800 font-bold">${orderTotal.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* What's next */}
        <View className="bg-white rounded-3xl p-5 mb-8 shadow-sm">
          <Text className="text-gray-700 font-semibold mb-1">What's next?</Text>
          <Text className="text-gray-400 text-sm leading-5">
            We'll handcraft your bracelet and ship it via USPS First Class. You'll get a tracking number once it ships.
          </Text>
        </View>

        {/* CTAs */}
        <View className="gap-3">
          <Button
            label="Build Another Bracelet"
            onPress={() => { router.dismissAll(); router.push('/builder') }}
            fullWidth
          />
          <Button
            label="Back to Home"
            onPress={() => router.dismissAll()}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
