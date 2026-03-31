import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getProductById } from '../../src/lib/products/catalog'
import { useCartStore } from '../../src/store/cart'
import { Button } from '../../src/components/ui/Button'
import { PRODUCT_IMAGE_MAP } from '../../src/lib/products/imageMap'

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const product = getProductById(id)
  const addProduct = useCartStore(s => s.addProduct)

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-gray-400">Product not found</Text>
      </SafeAreaView>
    )
  }

  function handleAddToCart() {
    addProduct(product!)
    Alert.alert('Added to cart! 🛒', product!.name, [
      { text: 'Keep Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/cart') },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="bg-white mx-4 rounded-3xl h-72 overflow-hidden mb-6 shadow-sm">
          {PRODUCT_IMAGE_MAP[product.imageUrl] ? (
            <Image
              source={PRODUCT_IMAGE_MAP[product.imageUrl]}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-9xl">📿</Text>
            </View>
          )}
        </View>

        <View className="px-5">
          <Text className="text-gray-800 text-2xl font-bold">{product.name}</Text>
          <Text className="text-sage-dark text-3xl font-bold mt-1 mb-3">${product.price}</Text>
          <Text className="text-gray-500 text-base leading-6 mb-6">{product.description}</Text>

          <View className="bg-cream-dark rounded-2xl p-4 mb-6">
            <Text className="text-gray-600 text-sm font-medium mb-1">Processing time</Text>
            <Text className="text-gray-800 text-sm">1–2 business days for pre-made</Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Add to Cart" onPress={handleAddToCart} fullWidth />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
