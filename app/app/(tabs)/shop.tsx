import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ALL_PRODUCTS } from '../../src/lib/products/catalog'
import { BraceletCard } from '../../src/components/ui/BraceletCard'

const TYPE_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'beaded',    label: 'Beaded' },
  { id: 'cord',      label: 'Cord' },
  { id: 'chain',     label: 'Chain' },
  { id: 'charm',     label: 'Charm' },
  { id: 'stackable', label: 'Sets' },
]

export default function ShopScreen() {
  const params = useLocalSearchParams<{ type?: string }>()
  const [activeType, setActiveType] = useState(params.type ?? 'all')

  const filtered = ALL_PRODUCTS.filter(p => {
    const typeMatch = activeType === 'all' || p.type === activeType
    return typeMatch
  })

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-gray-800">Shop</Text>
      </View>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
      >
        {TYPE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setActiveType(f.id)}
            className={`px-4 py-2 rounded-full ${activeType === f.id ? 'bg-sage' : 'bg-white'}`}
          >
            <Text className={`text-sm font-medium ${activeType === f.id ? 'text-white' : 'text-gray-600'}`}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View className="flex-row flex-wrap justify-between">
          {filtered.map(product => (
            <BraceletCard
              key={product.id}
              product={product}
              onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
            />
          ))}
        </View>
        {filtered.length === 0 && (
          <View className="items-center py-20">
            <Text className="text-4xl mb-3">📿</Text>
            <Text className="text-gray-500 text-base">No bracelets found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
