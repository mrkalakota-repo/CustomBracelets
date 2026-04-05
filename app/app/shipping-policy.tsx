import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SECTIONS = [
  {
    title: 'Free Shipping',
    icon: '🎉',
    body: 'All orders $20 and over ship free within the US. Orders under $20 ship for a flat $3.99.',
  },
  {
    title: 'Processing Time',
    icon: '⏱️',
    body: 'Standard orders are processed within 1–3 business days. Rush orders (add-on in the builder) are processed next business day.',
  },
  {
    title: 'Delivery',
    icon: '📦',
    body: 'US shipping takes 3–5 business days after processing via USPS First Class or Priority Mail. You\'ll receive a tracking number once your order ships.',
  },
  {
    title: 'International',
    icon: '🌍',
    body: 'International shipping is not available at this time. We\'re working on it!',
  },
  {
    title: 'Lost or Damaged Orders',
    icon: '💌',
    body: 'If your order arrives damaged or doesn\'t show up, reach out to us and we\'ll make it right. We want you to love your bracelet.',
  },
]

export default function ShippingPolicyScreen() {
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
        <Text className="text-xl font-bold text-gray-800 ml-2">Shipping Policy</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-gray-400 text-sm mb-6">
          We hand-pack every order with care. Here's what to expect.
        </Text>

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
          <Text className="text-sage-dark text-sm font-medium text-center">
            Questions? We're here to help. 💚
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Contact us via the app or at thechiccharmco@gmail.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
