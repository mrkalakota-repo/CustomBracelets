import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const SECTIONS = [
  {
    title: 'What we collect',
    icon: '📋',
    body: 'Name and phone number when you create an account. Shipping address and payment details when you check out — payment details go directly to Stripe and we never see your card number. Basic usage data to understand how the app is used.',
  },
  {
    title: 'How we use it',
    icon: '🔐',
    body: 'To process and ship your order, send shipping updates, and occasionally notify you about new drops (only if you opt in). We do not sell your data.',
  },
  {
    title: 'Third parties',
    icon: '🤝',
    body: 'We share data only with Stripe (payment processing) and Klaviyo (email marketing), both of which process data on your behalf under their own privacy policies.',
  },
  {
    title: 'COPPA',
    icon: '👧',
    body: 'We do not knowingly collect personal information from children under 13. By creating an account, you confirm you are at least 13 years old.',
  },
  {
    title: 'Your rights',
    icon: '✉️',
    body: 'You can request deletion of your account and data at any time by emailing us. Marketing messages include an opt-out option.',
  },
]

export default function PrivacyPolicyScreen() {
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
        <Text className="text-xl font-bold text-gray-800 ml-2">Privacy Policy</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-gray-400 text-sm mb-6">Last updated: April 2026</Text>

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
          <Text className="text-sage-dark text-sm font-medium text-center">Questions about your privacy?</Text>
          <Text className="text-gray-400 text-xs text-center mt-1">hello@chiccharmco.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
