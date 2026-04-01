import React, { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_S = 30

export default function VerifyPhoneScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const { verifyOtp, resendOtp } = useAuth()

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRef = useRef<TextInput>(null)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_S)
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleResend() {
    if (resending || cooldown > 0) return
    setResending(true)
    const { error } = await resendOtp(phone ?? '')
    setResending(false)
    if (error) {
      Alert.alert('Could not resend', error)
    } else {
      Alert.alert('Code sent', 'A new code has been sent to ' + phone + '.')
      startCooldown()
    }
  }

  async function handleVerify() {
    if (otp.length < OTP_LENGTH) return
    if (loading) return

    setLoading(true)
    const { error } = await verifyOtp(phone ?? '', otp)
    setLoading(false)

    if (error) {
      Alert.alert('Verification failed', error)
      setOtp('')
      return
    }

    // Session is now active — go back to profile
    router.dismissAll()
    router.replace('/(tabs)/profile')
  }

  function handleOtpChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(digits)
    if (digits.length === OTP_LENGTH) handleVerify()
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 px-8 justify-center">
          <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start">
            <Text className="text-sage text-base font-semibold">← Back</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-gray-800 mb-2">Check your texts</Text>
          <Text className="text-gray-400 text-sm mb-8">
            We sent a 6-digit code to{' '}
            <Text className="text-gray-700 font-medium">{phone}</Text>.{'\n'}
            Enter it below to verify your number.
          </Text>

          {/* OTP dot display */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-center gap-3 mb-8"
          >
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View
                key={i}
                className={`w-10 h-12 rounded-xl items-center justify-center border-2 ${
                  i === otp.length
                    ? 'border-sage bg-white'
                    : i < otp.length
                    ? 'border-sage bg-sage/10'
                    : 'border-cream-dark bg-white'
                }`}
              >
                <Text className="text-gray-800 text-xl font-bold">
                  {i < otp.length ? '•' : ''}
                </Text>
              </View>
            ))}
          </TouchableOpacity>

          {/* Hidden input */}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            style={{ position: 'absolute', opacity: 0, height: 0 }}
          />

          <TouchableOpacity
            onPress={handleVerify}
            disabled={otp.length < OTP_LENGTH || loading}
            className={`rounded-full py-4 items-center ${otp.length === OTP_LENGTH && !loading ? 'bg-sage' : 'bg-gray-200'}`}
          >
            <Text className={`font-bold text-base ${otp.length === OTP_LENGTH && !loading ? 'text-white' : 'text-gray-400'}`}>
              {loading ? 'Verifying…' : 'Verify'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            disabled={resending || cooldown > 0}
            className="mt-6 self-center"
            accessibilityRole="button"
            accessibilityLabel="Resend verification code"
          >
            <Text className="text-gray-400 text-xs text-center">
              {`Didn\u2019t get a code? `}
              {resending ? (
                <Text className="text-sage font-medium">Sending…</Text>
              ) : cooldown > 0 ? (
                <Text className="text-gray-300 font-medium">Resend in {cooldown}s</Text>
              ) : (
                <Text className="text-sage font-medium">Resend</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
