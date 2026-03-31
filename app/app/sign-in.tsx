import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

type Mode = 'signin' | 'signup'

const PIN_LENGTH = 6

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('signin')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [name, setName] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  const pinRef = useRef<TextInput>(null)
  const confirmPinRef = useRef<TextInput>(null)

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  function handlePhoneChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 10)
    setPhone(formatPhone(digits))
    if (digits.length === 10) pinRef.current?.focus()
  }

  function handlePinChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, PIN_LENGTH)
    setPin(digits)
    if (digits.length === PIN_LENGTH && mode === 'signup') confirmPinRef.current?.focus()
  }

  function handleConfirmPinChange(text: string) {
    setConfirmPin(text.replace(/\D/g, '').slice(0, PIN_LENGTH))
  }

  function rawPhone() {
    return phone.replace(/\D/g, '')
  }

  function handleSubmit() {
    if (rawPhone().length < 10) {
      Alert.alert('Invalid phone number', 'Please enter a valid 10-digit US phone number.')
      return
    }
    if (pin.length < PIN_LENGTH) {
      Alert.alert('Incomplete PIN', `Your PIN must be ${PIN_LENGTH} digits.`)
      return
    }
    if (mode === 'signup') {
      if (!name.trim()) {
        Alert.alert('Missing name', 'Please enter your name.')
        return
      }
      if (pin !== confirmPin) {
        Alert.alert('PINs don\'t match', 'Please make sure both PINs match.')
        return
      }
      if (!ageConfirmed) {
        Alert.alert('Age confirmation required', 'Please confirm you are 13 or older.')
        return
      }
    }

    // TODO: wire up Supabase phone OTP or custom PIN auth
    Alert.alert(
      mode === 'signin' ? 'Sign In' : 'Account Created',
      'Phone + PIN authentication coming soon! Will be connected to Supabase.',
      [{ text: 'OK', onPress: () => router.back() }],
    )
  }

  function switchMode(m: Mode) {
    setMode(m)
    setPin('')
    setConfirmPin('')
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-sage text-base font-semibold">← Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-800 mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </Text>
          <Text className="text-gray-400 text-sm mb-8">
            {mode === 'signin'
              ? 'Sign in with your phone number and PIN.'
              : 'Join The Bead Bar for early drop access and saved wishlists.'}
          </Text>

          {/* Tab Toggle */}
          <View className="flex-row bg-white rounded-2xl p-1 mb-8 shadow-sm">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-xl items-center ${mode === m ? 'bg-sage' : ''}`}
              >
                <Text className={`font-semibold text-sm ${mode === m ? 'text-white' : 'text-gray-500'}`}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Name — sign up only */}
          {mode === 'signup' && (
            <View className="mb-4">
              <Text className="text-gray-600 text-sm font-medium mb-1.5">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => pinRef.current?.focus()}
                className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-gray-600 text-sm font-medium mb-1.5">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="(555) 000-0000"
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => pinRef.current?.focus()}
              className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* PIN */}
          <View className="mb-4">
            <Text className="text-gray-600 text-sm font-medium mb-1.5">
              {mode === 'signin' ? 'PIN' : 'Create PIN'}
            </Text>
            {/* Visual PIN dots */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => pinRef.current?.focus()}
              className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 flex-row justify-center gap-4"
            >
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <View
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < pin.length ? 'bg-sage' : 'bg-cream-dark'}`}
                />
              ))}
            </TouchableOpacity>
            {/* Hidden actual input */}
            <TextInput
              ref={pinRef}
              value={pin}
              onChangeText={handlePinChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              secureTextEntry
              returnKeyType={mode === 'signup' ? 'next' : 'done'}
              onSubmitEditing={() => mode === 'signup' ? confirmPinRef.current?.focus() : handleSubmit()}
              style={{ position: 'absolute', opacity: 0, height: 0 }}
            />
          </View>

          {/* Confirm PIN — sign up only */}
          {mode === 'signup' && (
            <View className="mb-6">
              <Text className="text-gray-600 text-sm font-medium mb-1.5">Confirm PIN</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => confirmPinRef.current?.focus()}
                className={`bg-white border rounded-2xl px-4 py-3.5 flex-row justify-center gap-4 ${
                  confirmPin.length === PIN_LENGTH && confirmPin !== pin
                    ? 'border-red-300'
                    : 'border-cream-dark'
                }`}
              >
                {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                  <View
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < confirmPin.length
                        ? confirmPin !== pin.slice(0, confirmPin.length) ? 'bg-red-400' : 'bg-sage'
                        : 'bg-cream-dark'
                    }`}
                  />
                ))}
              </TouchableOpacity>
              {confirmPin.length === PIN_LENGTH && confirmPin !== pin && (
                <Text className="text-red-400 text-xs mt-1.5 ml-1">PINs don't match</Text>
              )}
              <TextInput
                ref={confirmPinRef}
                value={confirmPin}
                onChangeText={handleConfirmPinChange}
                keyboardType="number-pad"
                maxLength={PIN_LENGTH}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={{ position: 'absolute', opacity: 0, height: 0 }}
              />
            </View>
          )}

          {/* COPPA — sign up only */}
          {mode === 'signup' && (
            <TouchableOpacity
              onPress={() => setAgeConfirmed(!ageConfirmed)}
              className="flex-row items-center gap-3 mb-6"
            >
              <View className={`w-5 h-5 rounded border-2 items-center justify-center ${ageConfirmed ? 'bg-sage border-sage' : 'border-gray-300'}`}>
                {ageConfirmed && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-gray-500 text-sm flex-1">I confirm I am 13 or older</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-sage rounded-full py-4 items-center mb-4"
          >
            <Text className="text-white font-bold text-base">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {mode === 'signin' && (
            <TouchableOpacity className="items-center py-2">
              <Text className="text-sage text-sm font-medium">Forgot PIN?</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
