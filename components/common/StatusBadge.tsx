import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/theme';

type StatusType =
  | 'completed'
  | 'inProgress'
  | 'pending'
  | 'cancelled'
  | 'urgent'
  | 'new'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default'
  | 'shipping'
  | 'delivered';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const getStatusStyles = (type: StatusType) => {
  switch (type) {
    case 'completed':
    case 'success':
    case 'delivered':
      return {
        backgroundColor: COLORS.successLight,
        color: COLORS.successDark
      };
    case 'inProgress':
    case 'shipping':
      return {
        backgroundColor: COLORS.primaryLight,
        color: COLORS.primaryDark
      };
    case 'pending':
    case 'warning':
      return {
        backgroundColor: COLORS.warningLight,
        color: COLORS.warningDark
      };
    case 'cancelled':
    case 'error':
      return {
        backgroundColor: COLORS.errorLight,
        color: COLORS.errorDark
      };
    case 'urgent':
      return {
        backgroundColor: COLORS.error,
        color: COLORS.textLight
      };
    case 'new':
    case 'info':
      return {
        backgroundColor: COLORS.infoLight,
        color: COLORS.info
      };
    default:
      return {
        backgroundColor: COLORS.backgroundSecondary,
        color: COLORS.textSecondary
      };
  }
};

// Helper to auto-detect status type from status text
export const getStatusType = (status: string): StatusType => {
  const s = status.toLowerCase();
  // Completed / delivered states
  if (['delivered', 'completed', 'done', 'ready', 'good', 'accepted'].includes(s)) {
    return 'completed';
  }
  // In-progress / active states (ORDER + SHIPMENT)
  if (['preparing', 'processing', 'in_progress', 'in transit', 'cooking', 'packing', 'approved', 'picking', 'delivering'].includes(s)) {
    return 'inProgress';
  }
  // Waiting / queued states
  if (['pending', 'waiting', 'scheduled', 'queued', 'waiting_for_production'].includes(s)) {
    return 'pending';
  }
  // Cancelled / rejected states
  if (['cancelled', 'rejected', 'failed', 'expired'].includes(s)) {
    return 'cancelled';
  }
  // Warning / complaint states
  if (['claimed', 'urgent', 'critical', 'high priority'].includes(s)) {
    return 'warning';
  }
  // New / fresh states
  if (['new', 'open', 'fresh'].includes(s)) {
    return 'new';
  }
  return 'default';
};

export function StatusBadge({
  status,
  type,
  size = 'md',
  style,
  textStyle
}: StatusBadgeProps) {
  const finalType = type || getStatusType(status);
  const { backgroundColor, color } = getStatusStyles(finalType);

  const sizeStyles = {
    sm: { paddingHorizontal: SPACING.sm, paddingVertical: 2, fontSize: TYPOGRAPHY.fontSize.xs },
    md: { paddingHorizontal: SPACING.md, paddingVertical: 4, fontSize: TYPOGRAPHY.fontSize.sm },
    lg: { paddingHorizontal: SPACING.base, paddingVertical: 6, fontSize: TYPOGRAPHY.fontSize.md },
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
        style
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize: sizeStyles[size].fontSize,
          },
          textStyle
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});
