import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCartStore } from '../../src/store/cart'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function TabIcon({ name, color, size }: { name: IoniconsName; color: string; size: number }) {
  return <Ionicons name={name} color={color} size={size} />
}

export default function TabLayout() {
  const itemCount = useCartStore(s => s.itemCount())

  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarStyle:     { backgroundColor: '#F5F0E8', borderTopColor: '#E8E0D0', height: 60, paddingBottom: 8 },
        tabBarActiveTintColor:   '#8FAF8A',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: -2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) =>
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size, focused }) =>
            <TabIcon name={focused ? 'bag' : 'bag-outline'} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color, size, focused }) =>
            <TabIcon name={focused ? 'flash' : 'flash-outline'} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) =>
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
