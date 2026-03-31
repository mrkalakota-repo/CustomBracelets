import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ALL_DROPS } from '../../src/lib/drops/registry'
import { Button } from '../../src/components/ui/Button'

function CountdownTimer({ launchDate }: { launchDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(launchDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [launchDate])

  return (
    <View className="flex-row gap-3 my-4">
      {[
        { value: timeLeft.days,    label: 'Days' },
        { value: timeLeft.hours,   label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map(({ value, label }) => (
        <View key={label} className="bg-white rounded-2xl px-4 py-3 items-center flex-1">
          <Text className="text-2xl font-bold text-sage-dark">{String(value).padStart(2, '0')}</Text>
          <Text className="text-gray-400 text-xs mt-1">{label}</Text>
        </View>
      ))}
    </View>
  )
}

export default function DropsScreen() {
  const [email, setEmail] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  const activeDrop = ALL_DROPS.find(d => d.status === 'upcoming' || d.status === 'live')

  function handleNotifyMe() {
    if (!email) return Alert.alert('Enter your email to get notified')
    if (!ageConfirmed) return Alert.alert('Please confirm you are 13 or older')
    Alert.alert('You\'re on the list! 🌸', `We'll notify ${email} when ${activeDrop?.name} drops.`)
    setEmail('')
    setAgeConfirmed(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-gray-800 mb-1">Drops</Text>
        <Text className="text-gray-500 text-sm mb-6">Limited releases. Once they're gone, they're gone.</Text>

        {ALL_DROPS.map(drop => (
          <View key={drop.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm">
            {/* Status Badge */}
            <View className={`self-start px-3 py-1 rounded-full mb-3 ${
              drop.status === 'live'     ? 'bg-red-100' :
              drop.status === 'upcoming' ? 'bg-sage/20' :
              drop.status === 'sold_out' ? 'bg-gray-100' : 'bg-gray-100'
            }`}>
              <Text className={`text-xs font-bold uppercase tracking-wider ${
                drop.status === 'live'     ? 'text-red-600' :
                drop.status === 'upcoming' ? 'text-sage-dark' :
                'text-gray-500'
              }`}>
                {drop.status === 'live'     ? '🔴 Live Now' :
                 drop.status === 'upcoming' ? '⏰ Coming Soon' :
                 drop.status === 'sold_out' ? '🚫 Sold Out' : 'Ended'}
              </Text>
            </View>

            <Text className="text-gray-800 text-xl font-bold">{drop.name}</Text>
            <Text className="text-gray-500 text-sm mt-1">{drop.theme}</Text>

            {/* Sneak Peek placeholder */}
            <View className="bg-cream rounded-2xl h-40 items-center justify-center my-4">
              <Text className="text-5xl">🌸</Text>
              <Text className="text-gray-400 text-sm mt-2">Sneak peek coming soon</Text>
            </View>

            {drop.status === 'upcoming' && (
              <>
                <Text className="text-gray-600 text-sm font-medium mb-1">Drops in:</Text>
                <CountdownTimer launchDate={drop.launchDate} />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border border-cream-dark rounded-full px-4 py-3 text-gray-800 text-sm mb-3"
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  onPress={() => setAgeConfirmed(!ageConfirmed)}
                  className="flex-row items-center gap-2 mb-4"
                >
                  <View className={`w-5 h-5 rounded border-2 items-center justify-center ${ageConfirmed ? 'bg-sage border-sage' : 'border-gray-300'}`}>
                    {ageConfirmed && <Text className="text-white text-xs">✓</Text>}
                  </View>
                  <Text className="text-gray-500 text-sm">I confirm I am 13 or older</Text>
                </TouchableOpacity>

                <Button label="Notify Me 🌸" onPress={handleNotifyMe} fullWidth />
              </>
            )}

            {drop.status === 'sold_out' && (
              <View className="bg-gray-100 rounded-2xl p-4 items-center">
                <Text className="text-gray-600 font-semibold">This drop has sold out</Text>
                <Text className="text-gray-400 text-sm mt-1">Join the waitlist for the next one</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
