import { Link, Stack } from 'expo-router'
import { View, Text } from 'react-native'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0E8' }}>
        <Text style={{ fontSize: 18, color: '#374151', marginBottom: 16 }}>This page doesn't exist.</Text>
        <Link href="/">
          <Text style={{ color: '#8FAF8A', fontWeight: '600' }}>Go to home</Text>
        </Link>
      </View>
    </>
  )
}
