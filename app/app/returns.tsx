import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SECTIONS = [
  {
    title: 'Return window',
    icon: '📅',
    body: '14 days from delivery to request a return or exchange. Items must be unworn and in original condition.',
  },
  {
    title: 'Final sale items',
    icon: '🔒',
    body: 'Custom-engraved or personalized items are final sale. BFF sets can only be returned as a complete set.',
  },
  {
    title: 'How to start a return',
    icon: '📧',
    body: 'Email hello@thebeadbar.com with your order number and reason for return. We\'ll send a prepaid return label within one business day.',
  },
  {
    title: 'Refunds',
    icon: '💳',
    body: 'Refunds are issued to your original payment method within 5–7 business days of us receiving the item.',
  },
  {
    title: 'Defective items',
    icon: '💌',
    body: 'If your bracelet arrives damaged or defective, reach out within 14 days and we\'ll replace it or refund you — no return shipment needed.',
  },
]

export default function ReturnsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">Returns &amp; Exchanges</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-gray-400 text-sm mb-6">We want you to love your bracelet. If something isn't right, we're here to help.</Text>

        {SECTIONS.map((s, i) => (
          <View key={s.title} className={`bg-white rounded-2xl p-5 shadow-sm ${i < SECTIONS.length - 1 ? 'mb-3' : ''}`}>
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">{s.icon}</Text>
              <Text className="text-gray-800 font-semibold text-base">{s.title}</Text>
            </View>
            <Text className="text-gray-500 text-sm leading-relaxed">{s.body}</Text>
          </View>
        ))}

        <View className="mt-6 bg-sage/10 rounded-2xl p-4">
          <Text className="text-sage-dark text-sm font-medium text-center">Start a return</Text>
          <Text className="text-gray-400 text-xs text-center mt-1">hello@thebeadbar.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
