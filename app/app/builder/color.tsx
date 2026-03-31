import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuilderStore } from '../../src/store/builder'
import { StepIndicator } from '../../src/components/ui/StepIndicator'
import { Button } from '../../src/components/ui/Button'

const COLORS = [
  { id: 'sage-green',   label: 'Sage Green',   hex: '#8FAF8A' },
  { id: 'cream',        label: 'Cream',        hex: '#F5F0E8' },
  { id: 'dusty-rose',   label: 'Dusty Rose',   hex: '#D4A0A0' },
  { id: 'sky-blue',     label: 'Sky Blue',     hex: '#A0C4D4' },
  { id: 'lavender',     label: 'Lavender',     hex: '#C4A0D4' },
  { id: 'peach',        label: 'Peach',        hex: '#F4C49E' },
  { id: 'soft-gold',    label: 'Soft Gold',    hex: '#C9A96E' },
  { id: 'white',        label: 'Pearl White',  hex: '#F8F6F3' },
]

export default function BuilderStep2() {
  const { primaryColor, setPrimaryColor, baseStyle } = useBuilderStore()

  function handleNext() {
    if (!primaryColor) return
    if (baseStyle === 'charm') {
      router.push('/builder/addons')
    } else {
      router.push('/builder/pattern')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Build Your Bracelet</Text>
      </View>

      <StepIndicator currentStep={2} totalSteps={5} />

      <Text className="text-gray-800 text-xl font-bold px-5 mt-2 mb-1">Choose a color</Text>
      <Text className="text-gray-400 text-sm px-5 mb-5">Pick your primary color for this season's palette.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <View className="flex-row flex-wrap gap-3 justify-between">
          {COLORS.map(color => (
            <TouchableOpacity
              key={color.id}
              onPress={() => setPrimaryColor(color.id)}
              className={`items-center bg-white rounded-2xl p-3 border-2 shadow-sm ${
                primaryColor === color.id ? 'border-sage' : 'border-transparent'
              }`}
              style={{ width: '47%' }}
            >
              <View
                className="w-16 h-16 rounded-full mb-2 border border-gray-100"
                style={{ backgroundColor: color.hex }}
              />
              <Text className="text-gray-700 text-sm font-medium text-center">{color.label}</Text>
              {primaryColor === color.id && <Text className="text-sage text-xs mt-1">✓ Selected</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-8 pt-3 border-t border-cream-dark">
        <Button label="Next: Pattern →" onPress={handleNext} fullWidth disabled={!primaryColor} />
      </View>
    </SafeAreaView>
  )
}
