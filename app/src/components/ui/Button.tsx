import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface Props {
  label:              string
  onPress:            () => void
  variant?:           'primary' | 'secondary' | 'outline'
  loading?:           boolean
  disabled?:          boolean
  fullWidth?:         boolean
  accessibilityLabel?: string
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, fullWidth, accessibilityLabel }: Props) {
  const base = `rounded-full py-4 items-center justify-center ${fullWidth ? 'w-full' : 'px-8'}`
  const variants = {
    primary:   'bg-sage',
    secondary: 'bg-cream-dark',
    outline:   'border-2 border-sage bg-transparent',
  }
  const textVariants = {
    primary:   'text-white font-semibold text-base',
    secondary: 'text-gray-800 font-semibold text-base',
    outline:   'text-sage-dark font-semibold text-base',
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ busy: !!loading, disabled: !!(disabled || loading) }}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : '#6B9068'} />
        : <Text className={textVariants[variant]}>{label}</Text>
      }
    </TouchableOpacity>
  )
}
