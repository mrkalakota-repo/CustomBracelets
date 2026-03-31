import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCartStore } from '../src/store/cart'
import { Button } from '../src/components/ui/Button'

export default function CheckoutScreen() {
  const { total, clearCart } = useCartStore()
  const cartTotal = total()
  const freeShipping = cartTotal >= 20
  const shippingCost = freeShipping ? 0 : 3.99
  const grandTotal = cartTotal + shippingCost

  const [form, setForm] = useState({
    email:   '',
    name:    '',
    address: '',
    city:    '',
    zip:     '',
    state:   '',
  })
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  function isValid() {
    return Object.values(form).every(v => v.trim()) && ageConfirmed
  }

  function handlePlaceOrder() {
    if (!isValid()) {
      Alert.alert('Please fill in all fields and confirm your age.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      clearCart()
      router.replace('/order-confirmation')
    }, 1500)
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <Text className="text-gray-500 text-2xl">‹</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-2">Checkout</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}>
        {/* Contact */}
        <Text className="text-gray-700 font-semibold mb-2">Contact</Text>
        <TextInput
          value={form.email}
          onChangeText={v => setForm(f => ({ ...f, email: v }))}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-white border border-cream-dark rounded-2xl px-4 py-3 text-gray-800 text-sm mb-3"
          placeholderTextColor="#9CA3AF"
        />

        {/* Shipping */}
        <Text className="text-gray-700 font-semibold mb-2 mt-2">Shipping Address</Text>
        {([
          { key: 'name',    placeholder: 'Full name',       keyboard: 'default' },
          { key: 'address', placeholder: 'Street address',  keyboard: 'default' },
          { key: 'city',    placeholder: 'City',            keyboard: 'default' },
          { key: 'state',   placeholder: 'State',           keyboard: 'default' },
          { key: 'zip',     placeholder: 'ZIP code',        keyboard: 'number-pad' },
        ] as const).map(field => (
          <TextInput
            key={field.key}
            value={form[field.key]}
            onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
            placeholder={field.placeholder}
            keyboardType={field.keyboard as any}
            className="bg-white border border-cream-dark rounded-2xl px-4 py-3 text-gray-800 text-sm mb-3"
            placeholderTextColor="#9CA3AF"
          />
        ))}

        {/* Payment */}
        <Text className="text-gray-700 font-semibold mb-2 mt-2">Payment</Text>
        <View className="bg-white border border-cream-dark rounded-2xl p-4 mb-3">
          <Text className="text-gray-400 text-sm text-center">
            Stripe payment form loads here{'\n'}
            <Text className="text-xs">(Apple Pay · Google Pay · Card)</Text>
          </Text>
        </View>

        {/* BNPL note */}
        <Text className="text-gray-400 text-xs text-center mb-4">
          Afterpay / Klarna available for buyers 18+ at next step
        </Text>

        {/* Age confirmation */}
        <TouchableOpacity
          onPress={() => setAgeConfirmed(!ageConfirmed)}
          className="flex-row items-center gap-3 mb-6"
        >
          <View className={`w-5 h-5 rounded border-2 items-center justify-center ${ageConfirmed ? 'bg-sage border-sage' : 'border-gray-300'}`}>
            {ageConfirmed && <Text className="text-white text-xs font-bold">✓</Text>}
          </View>
          <Text className="text-gray-500 text-sm flex-1">I confirm I am 13 or older</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="font-semibold text-gray-800 mb-3">Order Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400 text-sm">Subtotal</Text>
            <Text className="text-gray-700 text-sm font-medium">${cartTotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400 text-sm">Shipping</Text>
            <Text className={`text-sm font-medium ${freeShipping ? 'text-sage-dark' : 'text-gray-700'}`}>
              {freeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}
            </Text>
          </View>
          <View className="flex-row justify-between border-t border-cream pt-2">
            <Text className="text-gray-800 font-bold">Total</Text>
            <Text className="text-gray-800 font-bold">${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-cream-dark px-5 pb-8 pt-4">
        <Button
          label={`Place Order — $${grandTotal.toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={!isValid()}
          fullWidth
        />
      </View>
    </SafeAreaView>
  )
}
