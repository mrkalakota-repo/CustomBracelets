import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const MENU_ITEMS = [
  { icon: '📦', label: 'Order History',    onPress: () => {} },
  { icon: '❤️', label: 'Wishlist',         onPress: () => {} },
  { icon: '🔔', label: 'Drop Alerts',      onPress: () => {} },
  { icon: '🚚', label: 'Shipping Policy',  onPress: () => {} },
  { icon: '↩️', label: 'Returns',          onPress: () => {} },
  { icon: '🔒', label: 'Privacy Policy',   onPress: () => {} },
]

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-gray-800 mb-6">Account</Text>

        {/* Guest State */}
        <View className="bg-white rounded-3xl p-6 items-center mb-6 shadow-sm">
          <View className="w-20 h-20 rounded-full bg-cream-dark items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-gray-800 text-lg font-semibold">Sign in to your account</Text>
          <Text className="text-gray-400 text-sm mt-1 text-center">Track orders, save your wishlist, and get early drop access.</Text>
          <TouchableOpacity className="mt-4 bg-sage rounded-full px-8 py-3">
            <Text className="text-white font-semibold">Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-5 py-4 ${index < MENU_ITEMS.length - 1 ? 'border-b border-cream' : ''}`}
            >
              <Text className="text-xl mr-3">{item.icon}</Text>
              <Text className="text-gray-800 text-base flex-1">{item.label}</Text>
              <Text className="text-gray-300">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
