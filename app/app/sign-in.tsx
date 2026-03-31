import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

type Mode = 'signin' | 'signup'

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.')
      return
    }
    if (mode === 'signup' && !name) {
      Alert.alert('Missing fields', 'Please enter your name.')
      return
    }
    if (mode === 'signup' && !ageConfirmed) {
      Alert.alert('Age confirmation required', 'Please confirm you are 13 or older.')
      return
    }
    // TODO: wire up Supabase auth
    Alert.alert(
      mode === 'signin' ? 'Sign In' : 'Account Created',
      'Authentication coming soon! Your account flow will be connected to Supabase.',
      [{ text: 'OK', onPress: () => router.back() }],
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
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
              ? 'Sign in to track orders and get drop alerts.'
              : 'Join The Bead Bar for early drop access and saved wishlists.'}
          </Text>

          {/* Tab Toggle */}
          <View className="flex-row bg-white rounded-2xl p-1 mb-8 shadow-sm">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl items-center ${mode === m ? 'bg-sage' : ''}`}
              >
                <Text className={`font-semibold text-sm ${mode === m ? 'text-white' : 'text-gray-500'}`}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fields */}
          {mode === 'signup' && (
            <View className="mb-4">
              <Text className="text-gray-600 text-sm font-medium mb-1.5">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                autoCapitalize="words"
                className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-gray-600 text-sm font-medium mb-1.5">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-600 text-sm font-medium mb-1.5">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              className="bg-white border border-cream-dark rounded-2xl px-4 py-3.5 text-gray-800 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* COPPA checkbox — sign up only */}
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
              <Text className="text-sage text-sm font-medium">Forgot password?</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
