import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCartStore } from '../src/store/cart'
import { Button } from '../src/components/ui/Button'

export default function CartScreen() {
  const { items, removeItem, total, itemCount } = useCartStore()
  const cartTotal = total()
  const freeShipping = cartTotal >= 20
  const shippingCost = freeShipping ? 0 : 3.99

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">Cart</Text>
        {itemCount() > 0 && (
          <Text className="text-gray-400 text-sm ml-2">({itemCount()} items)</Text>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🛒</Text>
          <Text className="text-gray-800 text-xl font-bold mb-2">Your cart is empty</Text>
          <Text className="text-gray-400 text-base text-center mb-6">Browse our collection or build a custom bracelet.</Text>
          <Button label="Start Shopping" onPress={() => { router.back(); router.push('/(tabs)/shop') }} />
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}>
            {/* Free shipping banner */}
            <View className={`rounded-2xl p-3 mb-4 ${freeShipping ? 'bg-sage/20' : 'bg-cream-dark'}`}>
              <Text className="text-center text-sm font-medium text-gray-700">
                {freeShipping
                  ? '🎉 Free shipping on your order!'
                  : `Add $${(20 - cartTotal).toFixed(2)} more for free shipping`}
              </Text>
            </View>

            {items.map(item => (
              <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center">
                <View className="w-16 h-16 bg-cream rounded-xl items-center justify-center mr-3">
                  <Text className="text-3xl">📿</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold text-sm" numberOfLines={1}>
                    {item.isCustom
                      ? `Custom ${item.baseStyle} bracelet`
                      : item.product?.name ?? 'Bracelet'
                    }
                  </Text>
                  {item.isCustom && item.primaryColor && (
                    <Text className="text-gray-400 text-xs mt-0.5 capitalize">
                      {item.primaryColor?.replace('-', ' ')} · {item.accentPattern?.replace('-', ' ')}
                    </Text>
                  )}
                  <Text className="text-sage-dark font-bold text-base mt-1">${item.price}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('Remove item?', undefined, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
                  ])}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Text className="text-gray-300 text-xl">🗑</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Checkout Bar */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-dark px-5 pb-8 pt-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-500 text-sm">Subtotal</Text>
              <Text className="text-gray-800 font-semibold text-sm">${cartTotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500 text-sm">Shipping</Text>
              <Text className={`font-semibold text-sm ${freeShipping ? 'text-sage-dark' : 'text-gray-800'}`}>
                {freeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-800 font-bold">Total</Text>
              <Text className="text-gray-800 font-bold text-lg">${(cartTotal + shippingCost).toFixed(2)}</Text>
            </View>
            <Button label="Checkout →" onPress={() => router.push('/checkout')} fullWidth />
          </View>
        </>
      )}
    </SafeAreaView>
  )
}
