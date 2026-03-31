import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuilderStore } from '../../src/store/builder'
import { StepIndicator } from '../../src/components/ui/StepIndicator'
import type { BaseStyle } from '../../src/lib/builder/compatibility'

const BASE_STYLES: { id: BaseStyle; label: string; emoji: string; description: string; price: number }[] = [
  { id: 'beaded',    label: 'Beaded',    emoji: '📿', description: 'Glass or stone beads on elastic', price: 12 },
  { id: 'cord',      label: 'Cord',      emoji: '🧵', description: 'Waxed cord, adjustable fit',      price: 10 },
  { id: 'chain',     label: 'Chain',     emoji: '⛓️',  description: '14k gold-filled, lobster clasp',  price: 18 },
  { id: 'charm',     label: 'Charm',     emoji: '✨', description: 'Cord or chain with custom charm',  price: 15 },
  { id: 'stackable', label: 'Set of 3',  emoji: '💫', description: 'Three curated matching bracelets', price: 25 },
]

export default function BuilderStep1() {
  const { baseStyle, setBaseStyle } = useBuilderStore()

  function handleSelect(style: BaseStyle) {
    setBaseStyle(style)
    router.push('/builder/color')
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-lg">✕</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Build Your Bracelet</Text>
      </View>

      <StepIndicator currentStep={1} totalSteps={5} />

      <Text className="text-gray-800 text-xl font-bold px-5 mt-2 mb-1">Choose a base style</Text>
      <Text className="text-gray-400 text-sm px-5 mb-5">This sets your bracelet's foundation.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 32 }}>
        {BASE_STYLES.map(style => (
          <TouchableOpacity
            key={style.id}
            onPress={() => handleSelect(style.id)}
            className={`flex-row items-center bg-white rounded-2xl p-4 shadow-sm border-2 ${
              baseStyle === style.id ? 'border-sage' : 'border-transparent'
            }`}
          >
            <Text className="text-3xl mr-4">{style.emoji}</Text>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base">{style.label}</Text>
              <Text className="text-gray-400 text-sm mt-0.5">{style.description}</Text>
            </View>
            <Text className="text-sage-dark font-bold text-base ml-2">${style.price}</Text>
            {baseStyle === style.id && <Text className="text-sage ml-2">✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
