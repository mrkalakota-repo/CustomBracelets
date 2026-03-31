import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ALL_PRODUCTS } from '../../src/lib/products/catalog'
import { BraceletCard } from '../../src/components/ui/BraceletCard'
import { useCartStore } from '../../src/store/cart'

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
  const itemCount = useCartStore(s => s.itemCount())

  const filtered = ALL_PRODUCTS.filter(p => {
    const typeMatch = activeType === 'all' || p.type === activeType
    return typeMatch
  })

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Shop</Text>
        <TouchableOpacity onPress={() => router.push('/cart')} className="w-10 h-10 items-center justify-center">
          <Text className="text-2xl">🛒</Text>
          {itemCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-sage rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">{itemCount > 9 ? '9+' : itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12, alignItems: 'center' }}
      >
        {TYPE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setActiveType(f.id)}
            style={{ height: 34 }}
            className={`px-4 rounded-full items-center justify-center ${activeType === f.id ? 'bg-sage' : 'bg-white'}`}
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
