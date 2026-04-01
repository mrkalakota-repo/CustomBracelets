import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useCartStore } from '../../src/store/cart'
import { useAuth } from '../../src/context/AuthContext'

const comingSoon = (label: string) => () =>
  Alert.alert(label, 'This feature is coming soon!')

const MENU_ITEMS = [
  { icon: '📦', label: 'Order History',    onPress: comingSoon('Order History'),              available: false },
  { icon: '❤️', label: 'Wishlist',         onPress: comingSoon('Wishlist'),                   available: false },
  { icon: '🔔', label: 'Drop Alerts',      onPress: comingSoon('Drop Alerts'),                available: false },
  { icon: '🚚', label: 'Shipping Policy',  onPress: () => router.push('/shipping-policy'),    available: true  },
  { icon: '↩️', label: 'Returns',          onPress: () => router.push('/returns'),            available: true  },
  { icon: '🔒', label: 'Privacy Policy',   onPress: () => router.push('/privacy-policy'),     available: true  },
  { icon: '📄', label: 'Terms of Service', onPress: () => router.push('/terms-of-service'),   available: true  },
]

export default function ProfileScreen() {
  const itemCount            = useCartStore(s => s.itemCount())
  const { user, loading, signOut } = useAuth()

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  const displayName  = user?.user_metadata?.name as string | undefined
  const displayPhone = user?.phone

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-5 pt-2 pb-3 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Account</Text>
        <TouchableOpacity
          onPress={() => router.push('/cart')}
          className="w-10 h-10 items-center justify-center"
          accessibilityLabel="Cart"
          accessibilityRole="button"
        >
          <Text className="text-2xl">🛒</Text>
          {itemCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-sage rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">{itemCount > 9 ? '9+' : itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>

        {loading ? (
          <View className="bg-white rounded-3xl p-6 items-center mb-6 shadow-sm">
            <ActivityIndicator color="#8FAF8A" />
          </View>
        ) : user ? (
          /* ── Signed-in state ── */
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 rounded-full bg-sage/20 items-center justify-center mr-4">
                <Text className="text-2xl">👤</Text>
              </View>
              <View className="flex-1">
                {displayName && (
                  <Text className="text-gray-800 text-lg font-bold">{displayName}</Text>
                )}
                {displayPhone && (
                  <Text className="text-gray-400 text-sm">{formatPhone(displayPhone)}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSignOut}
              className="border border-gray-200 rounded-full py-2.5 items-center"
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Text className="text-gray-500 text-sm font-medium">Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Guest state ── */
          <View className="bg-white rounded-3xl p-6 items-center mb-6 shadow-sm">
            <View className="w-20 h-20 rounded-full bg-cream-dark items-center justify-center mb-3">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-gray-800 text-lg font-semibold">Sign in to your account</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Track orders, save your wishlist, and get early drop access.
            </Text>
            <TouchableOpacity
              className="mt-4 bg-sage rounded-full px-8 py-3"
              onPress={() => router.push('/sign-in')}
              accessibilityRole="button"
              accessibilityLabel="Sign in or sign up"
            >
              <Text className="text-white font-semibold">Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Menu */}
        <View className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-5 py-4 ${index < MENU_ITEMS.length - 1 ? 'border-b border-cream' : ''}`}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <Text className="text-xl mr-3">{item.icon}</Text>
              <Text className="text-gray-800 text-base flex-1">{item.label}</Text>
              {!item.available && (
                <Text className="text-gray-300 text-xs mr-2">Soon</Text>
              )}
              <Text className="text-gray-300">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  const local  = digits.startsWith('1') ? digits.slice(1) : digits
  if (local.length !== 10) return e164
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
}
