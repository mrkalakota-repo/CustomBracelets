import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuilderStore } from '../../src/store/builder'
import { StepIndicator } from '../../src/components/ui/StepIndicator'
import { Button } from '../../src/components/ui/Button'
import { ADDON_PRICES } from '../../src/lib/builder/pricing'
import type { AddOns } from '../../src/lib/builder/pricing'

const CHARMS = [
  { id: 'star',   label: 'Star',   emoji: '⭐' },
  { id: 'heart',  label: 'Heart',  emoji: '❤️' },
  { id: 'moon',   label: 'Moon',   emoji: '🌙' },
  { id: 'flower', label: 'Flower', emoji: '🌸' },
  { id: 'leaf',   label: 'Leaf',   emoji: '🍃' },
]

export default function BuilderStep4() {
  const { addOns, setAddOns } = useBuilderStore()
  const current: AddOns = (addOns as AddOns) ?? {}

  function toggle<K extends keyof AddOns>(key: K, value: AddOns[K]) {
    const next = { ...current }
    if (next[key] === value) {
      delete next[key]
    } else {
      ;(next as Record<string, unknown>)[key] = value
    }
    setAddOns(next)
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-2">Build Your Bracelet</Text>
      </View>

      <StepIndicator currentStep={4} totalSteps={5} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <Text className="text-gray-800 text-xl font-bold mt-2 mb-1">Add-ons</Text>
        <Text className="text-gray-400 text-sm mb-5">All optional. Skip to continue.</Text>

        {/* Charm Picker */}
        <Text className="text-gray-700 font-semibold mb-2">Add a Charm <Text className="text-gray-400 font-normal text-sm">(+${ADDON_PRICES.charm})</Text></Text>
        <View className="flex-row gap-2 mb-5 flex-wrap">
          {CHARMS.map(charm => (
            <TouchableOpacity
              key={charm.id}
              onPress={() => toggle('charm', charm.id)}
              className={`items-center bg-white rounded-xl p-3 border-2 ${current.charm === charm.id ? 'border-sage' : 'border-transparent'}`}
              style={{ minWidth: 64 }}
            >
              <Text className="text-2xl">{charm.emoji}</Text>
              <Text className="text-xs text-gray-500 mt-1">{charm.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Text */}
        <Text className="text-gray-700 font-semibold mb-2">Custom Text <Text className="text-gray-400 font-normal text-sm">(+${ADDON_PRICES.text})</Text></Text>
        <TextInput
          value={current.text ?? ''}
          onChangeText={val => setAddOns({ ...current, text: val || undefined })}
          placeholder="e.g. BFF, your name, a word..."
          className="bg-white border border-cream-dark rounded-2xl px-4 py-3 text-gray-800 text-sm mb-5"
          placeholderTextColor="#9CA3AF"
          maxLength={12}
        />

        {/* Gift Wrap */}
        <TouchableOpacity
          onPress={() => toggle('giftWrap', true)}
          className={`flex-row items-center bg-white rounded-2xl p-4 border-2 mb-3 ${current.giftWrap ? 'border-sage' : 'border-transparent'} shadow-sm`}
        >
          <Text className="text-2xl mr-3">🎁</Text>
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">Gift Wrapping</Text>
            <Text className="text-gray-400 text-sm">Kraft box + sage tissue + card</Text>
          </View>
          <Text className="text-sage-dark font-semibold">+${ADDON_PRICES.giftWrap}</Text>
          {current.giftWrap && <Text className="text-sage ml-2">✓</Text>}
        </TouchableOpacity>

        {/* Rush */}
        <TouchableOpacity
          onPress={() => toggle('rush', true)}
          className={`flex-row items-center bg-white rounded-2xl p-4 border-2 ${current.rush ? 'border-sage' : 'border-transparent'} shadow-sm`}
        >
          <Text className="text-2xl mr-3">⚡</Text>
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">Rush Processing</Text>
            <Text className="text-gray-400 text-sm">Ships in 1 business day</Text>
          </View>
          <Text className="text-sage-dark font-semibold">+${ADDON_PRICES.rush}</Text>
          {current.rush && <Text className="text-sage ml-2">✓</Text>}
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-8 pt-3 border-t border-cream-dark">
        <Button label="Preview My Bracelet →" onPress={() => router.push('/builder/preview')} fullWidth />
      </View>
    </SafeAreaView>
  )
}
