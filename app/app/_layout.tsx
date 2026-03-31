import '../src/styles/global.css'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AuthProvider } from '../src/context/AuthContext'

SplashScreen.preventAutoHideAsync()

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    Font.loadAsync({
      ...Ionicons.font,
    }).then(() => {
      setFontsLoaded(true)
      SplashScreen.hideAsync()
    }).catch(() => {
      setFontsLoaded(true)
      SplashScreen.hideAsync()
    })
  }, [])

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} merchantIdentifier="merchant.com.thebeadbar.app">
          <StatusBar style="dark" backgroundColor="#F5F0E8" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="builder" options={{ presentation: 'modal' }} />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-confirmation" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="verify-phone" />
            <Stack.Screen name="shipping-policy" />
          </Stack>
        </StripeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
