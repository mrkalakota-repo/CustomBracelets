import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuilderStore } from '../../src/store/builder'
import { useCartStore } from '../../src/store/cart'
import { StepIndicator } from '../../src/components/ui/StepIndicator'
import { Button } from '../../src/components/ui/Button'
import { calculatePrice } from '../../src/lib/builder/pricing'
import type { AddOns } from '../../src/lib/builder/pricing'

export default function BuilderPreview() {
  const builder = useBuilderStore()
  const addToCart = useCartStore(s => s.addCustom)

  const addOns = (builder.addOns as AddOns) ?? {}
  const price = builder.baseStyle ? calculatePrice(builder.baseStyle, addOns) : 0

  function handleAddToCart() {
    if (!builder.baseStyle) return
    addToCart({
      baseStyle:     builder.baseStyle,
      primaryColor:  builder.primaryColor ?? undefined,
      accentPattern: builder.accentPattern ?? undefined,
      addOns,
      price,
      quantity:      1,
      isCustom:      true,
    })
    builder.resetBuilder()
    router.dismissAll()
    router.push('/cart')
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `I just built a custom ${builder.baseStyle} bracelet on The Bead Bar! Check it out → thebeadbar.com`,
        title:   'My Custom Bracelet',
      })
    } catch {}
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Your Bracelet</Text>
      </View>

      <StepIndicator currentStep={5} totalSteps={5} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {/* Preview Card */}
        <View className="bg-white rounded-3xl p-6 items-center shadow-sm mt-2 mb-6">
          <Text className="text-8xl mb-4">📿</Text>
          <Text className="text-gray-800 text-2xl font-bold capitalize">{builder.baseStyle} Bracelet</Text>
          {builder.primaryColor && (
            <Text className="text-gray-500 text-base mt-1 capitalize">{builder.primaryColor?.replace('-', ' ')}</Text>
          )}
          {builder.accentPattern && (
            <Text className="text-gray-400 text-sm capitalize">{builder.accentPattern?.replace('-', ' ')} pattern</Text>
          )}
          <Text className="text-sage-dark text-3xl font-bold mt-4">${price}</Text>
        </View>

        {/* Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-800 font-semibold mb-3">Order Summary</Text>
          {[
            { label: 'Base style',    value: builder.baseStyle },
            { label: 'Color',         value: builder.primaryColor?.replace('-', ' ') },
            { label: 'Pattern',       value: builder.accentPattern?.replace('-', ' ') },
            { label: 'Charm',         value: addOns.charm },
            { label: 'Custom text',   value: addOns.text },
            { label: 'Gift wrap',     value: addOns.giftWrap ? 'Yes' : null },
            { label: 'Rush',          value: addOns.rush ? 'Yes' : null },
          ].filter(row => row.value).map(row => (
            <View key={row.label} className="flex-row justify-between py-1.5 border-b border-cream last:border-0">
              <Text className="text-gray-400 text-sm capitalize">{row.label}</Text>
              <Text className="text-gray-700 text-sm capitalize font-medium">{String(row.value)}</Text>
            </View>
          ))}
        </View>

        {/* Share */}
        <TouchableOpacity
          onPress={handleShare}
          className="bg-cream-dark rounded-2xl p-4 flex-row items-center justify-center gap-2 mb-4"
        >
          <Text className="text-gray-600 font-medium">Share to TikTok / Instagram</Text>
          <Text>↗</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-8 pt-3 border-t border-cream-dark">
        <Button label={`Add to Cart — $${price}`} onPress={handleAddToCart} fullWidth />
      </View>
    </SafeAreaView>
  )
}
