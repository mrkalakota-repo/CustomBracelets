import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  currentStep: number
  totalSteps:  number
}

export function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-2 py-3">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step === currentStep
                ? 'bg-sage'
                : step < currentStep
                ? 'bg-sage-dark'
                : 'bg-cream-dark'
            }`}
          >
            <Text className={`text-xs font-bold ${step <= currentStep ? 'text-white' : 'text-gray-400'}`}>
              {step}
            </Text>
          </View>
          {step < totalSteps && (
            <View className={`w-6 h-0.5 ${step < currentStep ? 'bg-sage-dark' : 'bg-cream-dark'}`} />
          )}
        </View>
      ))}
    </View>
  )
}
