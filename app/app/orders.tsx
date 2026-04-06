import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { supabase } from '../src/lib/supabase/client'
import { useAuth } from '../src/context/AuthContext'

interface OrderItem {
  id:         string
  name:       string
  quantity:   number
  unit_price: number
}

interface Order {
  id:          string
  created_at:  string
  total:       number
  status:      string
  order_items: OrderItem[]
}

export default function OrdersScreen() {
  const { user } = useAuth()
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    supabase
      .from('orders')
      .select('id, created_at, total, status, order_items(id, name, quantity, unit_price)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          setError('Could not load orders. Please try again.')
        } else {
          setOrders((data ?? []) as Order[])
        }
        setLoading(false)
      })
  }, [user])

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-2"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Order History</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#8FAF8A" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">⚠️</Text>
          <Text className="text-gray-700 font-semibold text-center mb-1">{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">📦</Text>
          <Text className="text-gray-700 text-lg font-semibold text-center mb-1">No orders yet</Text>
          <Text className="text-gray-400 text-sm text-center">Your orders will appear here after you place one.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12 }}>
          {orders.map(order => (
            <View key={order.id} className="bg-white rounded-3xl p-5 shadow-sm">
              {/* Order header */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-400 text-xs font-mono" numberOfLines={1}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  order.status === 'shipped'   ? 'bg-blue-50' :
                  order.status === 'refunded'  ? 'bg-gray-100' :
                  'bg-sage/10'
                }`}>
                  <Text className={`text-xs font-semibold capitalize ${
                    order.status === 'shipped'   ? 'text-blue-600' :
                    order.status === 'refunded'  ? 'text-gray-500' :
                    'text-sage-dark'
                  }`}>
                    {order.status ?? 'Processing'}
                  </Text>
                </View>
              </View>

              {/* Items */}
              {order.order_items?.map(item => (
                <View key={item.id} className="flex-row justify-between py-1.5 border-b border-cream last:border-0">
                  <Text className="text-gray-600 text-sm flex-1 mr-2" numberOfLines={1}>
                    {item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  </Text>
                  <Text className="text-gray-700 text-sm font-medium">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

              {/* Total */}
              <View className="flex-row justify-between pt-3 mt-1">
                <Text className="text-gray-800 font-bold">Total</Text>
                <Text className="text-gray-800 font-bold">${Number(order.total).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
