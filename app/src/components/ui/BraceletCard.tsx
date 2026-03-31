import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import type { Product } from '../../lib/products/catalog'
import { PRODUCT_IMAGE_MAP } from '../../lib/products/imageMap'

interface Props {
  product: Product
  onPress: () => void
}

export function BraceletCard({ product, onPress }: Props) {
  const imageSource = PRODUCT_IMAGE_MAP[product.imageUrl]

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4 mx-1"
      style={{ width: '47%' }}
    >
      <View className="bg-cream h-40 items-center justify-center">
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        ) : (
          <Text className="text-4xl">📿</Text>
        )}
      </View>
      <View className="p-3">
        <Text className="font-semibold text-gray-800 text-sm" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-sage-dark font-bold text-base mt-1">
          ${product.price}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
