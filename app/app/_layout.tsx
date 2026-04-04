import '../src/styles/global.css'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AuthProvider } from '../src/context/AuthContext'

SplashScreen.preventAutoHideAsync()

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} merchantIdentifier="merchant.com.chiccharmco.app">
          <StatusBar style="dark" backgroundColor="#F5F0E8" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="builder" options={{ presentation: 'modal' }} />
            <Stack.Screen name="product/[id]" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-confirmation" />
            <Stack.Screen name="sign-in"          options={{ presentation: 'modal' }} />
            <Stack.Screen name="verify-phone"    options={{ presentation: 'modal' }} />
            <Stack.Screen name="shipping-policy" />
            <Stack.Screen name="privacy-policy"  />
            <Stack.Screen name="returns"         />
            <Stack.Screen name="terms-of-service" />
          </Stack>
        </StripeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
