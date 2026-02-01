import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp, Platform } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'glass';
}

export function Card({ children, style, onPress, disabled, variant = 'default' }: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    variant === 'glass' && styles.glass,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg, // Increased radius
    padding: SPACING.lg, // More breathing room
    marginBottom: SPACING.md,
    ...SHADOWS.sm, // Softer default shadow
    borderWidth: 1, // Add light border
    borderColor: COLORS.borderDark, // Darker border for visibility
  },
  elevated: {
    ...SHADOWS.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: COLORS.backgroundSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    ...SHADOWS.sm,
  },
});
