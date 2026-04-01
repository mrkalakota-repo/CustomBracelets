import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SECTIONS = [
  {
    title: 'Eligibility',
    icon: '👤',
    body: 'You must be at least 13 years old to use this app or place an order. By creating an account you confirm you meet this requirement.',
  },
  {
    title: 'Orders & Pricing',
    icon: '🛒',
    body: 'All prices are in USD. We reserve the right to cancel any order if a pricing error occurs — you will receive a full refund. Custom and limited-edition drop items are final sale unless defective on arrival.',
  },
  {
    title: 'Shipping',
    icon: '📦',
    body: 'We ship within the US only. Estimated delivery times are not guaranteed. See our Shipping Policy for full details.',
  },
  {
    title: 'Returns',
    icon: '↩️',
    body: 'We accept returns within 14 days of delivery for unworn items. Custom-engraved items are final sale. See our Returns Policy for full details.',
  },
  {
    title: 'Intellectual Property',
    icon: '🎨',
    body: 'All designs, images, and content are owned by The Bead Bar. You may not reproduce or distribute them without written permission.',
  },
  {
    title: 'Limitation of Liability',
    icon: '⚖️',
    body: 'The Bead Bar is not liable for indirect or consequential damages. Our total liability for any claim is limited to the amount you paid for the order in question.',
  },
  {
    title: 'Changes to These Terms',
    icon: '📝',
    body: 'We may update these terms from time to time. Continued use of the app after changes are posted constitutes acceptance of the new terms.',
  },
]

export default function TermsOfServiceScreen() {
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
        <Text className="text-xl font-bold text-gray-800 ml-2">Terms of Service</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-gray-400 text-sm mb-6">Last updated: April 2026. By using this app you agree to these terms.</Text>

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
          <Text className="text-sage-dark text-sm font-medium text-center">Questions?</Text>
          <Text className="text-gray-400 text-xs text-center mt-1">hello@thebeadbar.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
