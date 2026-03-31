import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuilderStore } from '../../src/store/builder'
import { StepIndicator } from '../../src/components/ui/StepIndicator'
import { Button } from '../../src/components/ui/Button'
import { getCompatiblePatterns } from '../../src/lib/builder/compatibility'

const PATTERN_LABELS: Record<string, { label: string; emoji: string }> = {
  solid:     { label: 'Solid',     emoji: '⬜' },
  'two-tone': { label: 'Two-Tone', emoji: '▨' },
  gradient:  { label: 'Gradient',  emoji: '🌈' },
  checker:   { label: 'Checker',   emoji: '♟' },
  stripe:    { label: 'Stripe',    emoji: '〰️' },
  knotted:   { label: 'Knotted',   emoji: '🪢' },
  braided:   { label: 'Braided',   emoji: '🎗️' },
  'dip-dye': { label: 'Dip Dye',  emoji: '🎨' },
  plain:     { label: 'Plain',     emoji: '➖' },
  twisted:   { label: 'Twisted',   emoji: '🌀' },
}

export default function BuilderStep3() {
  const { accentPattern, setAccentPattern, baseStyle } = useBuilderStore()
  const patterns = baseStyle ? getCompatiblePatterns(baseStyle) : []

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Build Your Bracelet</Text>
      </View>

      <StepIndicator currentStep={3} totalSteps={5} />

      <Text className="text-gray-800 text-xl font-bold px-5 mt-2 mb-1">Choose a pattern</Text>
      <Text className="text-gray-400 text-sm px-5 mb-5">These options are compatible with your base style.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <View className="flex-row flex-wrap gap-3 justify-between">
          {patterns.map(pattern => {
            const info = PATTERN_LABELS[pattern] ?? { label: pattern, emoji: '✦' }
            return (
              <TouchableOpacity
                key={pattern}
                onPress={() => setAccentPattern(pattern)}
                className={`items-center bg-white rounded-2xl p-4 border-2 shadow-sm ${
                  accentPattern === pattern ? 'border-sage' : 'border-transparent'
                }`}
                style={{ width: '47%' }}
              >
                <Text className="text-3xl mb-2">{info.emoji}</Text>
                <Text className="text-gray-700 text-sm font-medium">{info.label}</Text>
                {accentPattern === pattern && <Text className="text-sage text-xs mt-1">✓ Selected</Text>}
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-8 pt-3 border-t border-cream-dark">
        <Button label="Next: Add-ons →" onPress={() => router.push('/builder/addons')} fullWidth disabled={!accentPattern} />
      </View>
    </SafeAreaView>
  )
}
