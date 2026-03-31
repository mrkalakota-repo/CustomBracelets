import React from 'react'
import { Stack } from 'expo-router'

export default function BuilderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="color" />
      <Stack.Screen name="pattern" />
      <Stack.Screen name="addons" />
      <Stack.Screen name="preview" />
    </Stack>
  )
}
