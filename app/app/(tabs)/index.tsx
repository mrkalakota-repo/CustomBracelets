import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ALL_PRODUCTS, FEATURED_PRODUCT_IDS } from '../../src/lib/products/catalog'
import { getActiveOrUpcomingDrop } from '../../src/lib/drops/registry'
import { getDropState } from '../../src/lib/drops/state'
import { BraceletCard } from '../../src/components/ui/BraceletCard'
import { Button } from '../../src/components/ui/Button'
import { PRODUCT_IMAGE_MAP } from '../../src/lib/products/imageMap'

const CATEGORIES = [
  { id: 'beaded',    label: 'Beaded', imageKey: 'sage-beaded' },
  { id: 'cord',      label: 'Cord',   imageKey: 'cream-cord'  },
  { id: 'charm',     label: 'Charm',  imageKey: 'gold-charm'  },
  { id: 'stackable', label: 'Sets',   imageKey: 'stackable'   },
]

export default function HomeScreen() {
  const activeDrop     = getActiveOrUpcomingDrop()
  const activeDropStatus = activeDrop ? getDropState(activeDrop.launchDate, activeDrop.stock) : null
  const featuredProducts = ALL_PRODUCTS.filter(p => FEATURED_PRODUCT_IDS.includes(p.id))

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-2">
          <Text className="text-2xl font-bold text-gray-800">Chic Charm Co.</Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')} className="h-10 px-3 items-center justify-center bg-white rounded-full shadow-sm">
              <Text className="text-xs font-semibold text-gray-700">Shop by Style</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cart')} className="w-10 h-10 items-center justify-center">
              <Text className="text-2xl">🛒</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drop Strip — active drop or "next drop" teaser */}
        {activeDrop ? (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/drops')}
            className="mx-4 mb-4 bg-sage rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-white text-xs font-semibold uppercase tracking-wider">
                {activeDropStatus === 'live' ? '🔴 LIVE NOW' : '⏰ Coming Soon'}
              </Text>
              <Text className="text-white text-lg font-bold mt-0.5">{activeDrop.name}</Text>
              <Text className="text-white/80 text-sm">{activeDrop.theme}</Text>
            </View>
            <Text className="text-white text-2xl">→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/drops')}
            className="mx-4 mb-4 bg-cream-dark rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Next Drop</Text>
              <Text className="text-gray-800 text-lg font-bold mt-0.5">Coming Soon</Text>
              <Text className="text-gray-500 text-sm">Be the first to know — join the list</Text>
            </View>
            <Text className="text-sage-dark text-2xl">→</Text>
          </TouchableOpacity>
        )}

        {/* Hero — Build Your Own */}
        <View className="mx-4 mb-6 bg-white rounded-3xl p-6 shadow-sm">
          <Text className="text-gray-500 text-sm uppercase tracking-wider mb-1">Custom</Text>
          <Text className="text-gray-800 text-2xl font-bold mb-2">Build Your Bracelet</Text>
          <Text className="text-gray-500 text-sm mb-4">Pick your style, colors, and charms. Get something uniquely yours.</Text>
          <Button label="Start Building →" onPress={() => router.push('/builder')} fullWidth />
        </View>

        {/* Shop by Category */}
        <View className="mb-6">
          <Text className="text-gray-800 text-lg font-bold px-5 mb-3">Shop by Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push({ pathname: '/(tabs)/shop', params: { type: cat.id } })}
                className="bg-white rounded-2xl overflow-hidden shadow-sm items-center"
                style={{ width: 80 }}
              >
                <Image
                  source={PRODUCT_IMAGE_MAP[cat.imageKey]}
                  style={{ width: 80, height: 64 }}
                  contentFit="cover"
                />
                <Text className="text-gray-700 text-xs font-medium py-2">{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View className="mb-6 px-4">
          <Text className="text-gray-800 text-lg font-bold mb-3">Bestsellers</Text>
          <View className="flex-row flex-wrap justify-between">
            {featuredProducts.map(product => (
              <BraceletCard
                key={product.id}
                product={product}
                onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
              />
            ))}
          </View>
        </View>

        {/* BFF Banner */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/builder', params: { mode: 'bff' } })}
          className="mx-4 mb-8 bg-cream-dark rounded-3xl p-5"
        >
          <Text className="text-gray-800 text-lg font-bold">Match with your bestie 👯</Text>
          <Text className="text-gray-500 text-sm mt-1">Build matching BFF sets. 2 bracelets, $2 off.</Text>
          <Text className="text-sage-dark font-semibold text-sm mt-3">Build BFF Set →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
