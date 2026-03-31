import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../src/components/ui/Button'

export default function OrderConfirmationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
      <Text className="text-7xl mb-5">📦</Text>
      <Text className="text-gray-800 text-2xl font-bold text-center mb-2">Order Placed!</Text>
      <Text className="text-gray-500 text-base text-center mb-1">
        You'll receive a confirmation email shortly with tracking info.
      </Text>
      <Text className="text-gray-400 text-sm text-center mb-8">
        Processing time: 1–3 business days
      </Text>

      <View className="bg-white rounded-3xl p-5 w-full shadow-sm mb-8">
        <Text className="text-gray-700 font-semibold mb-1">What's next?</Text>
        <Text className="text-gray-400 text-sm leading-5">
          We'll handcraft your bracelet and ship it via USPS First Class. You'll get a tracking number once it ships.
        </Text>
      </View>

      <View className="w-full gap-3">
        <Button
          label="Build Another Bracelet"
          onPress={() => { router.dismissAll(); router.push('/builder') }}
          fullWidth
        />
        <Button
          label="Back to Home"
          onPress={() => { router.dismissAll() }}
          variant="outline"
          fullWidth
        />
      </View>
    </SafeAreaView>
  )
}
