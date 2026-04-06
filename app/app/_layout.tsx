import '../src/styles/global.css'
import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Sentry from '@sentry/react-native'
import { PostHogProvider } from 'posthog-react-native'
import { AuthProvider } from '../src/context/AuthContext'

const SENTRY_DSN     = process.env.EXPO_PUBLIC_SENTRY_DSN
const POSTHOG_KEY    = process.env.EXPO_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST   = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com'

if (SENTRY_DSN) {
  Sentry.init({
    dsn:              SENTRY_DSN,
    tracesSampleRate: 0.1,
    // Disable in development — avoids noise during local builds
    enabled: !__DEV__,
  })
}

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

  const inner = (
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

  if (!POSTHOG_KEY) return inner

  return (
    <PostHogProvider apiKey={POSTHOG_KEY} options={{ host: POSTHOG_HOST }}>
      {inner}
    </PostHogProvider>
  )
}
