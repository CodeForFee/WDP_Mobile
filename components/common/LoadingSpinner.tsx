import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Spinner dựa trên assets/images/loading.svg (hai hình tròn đổi chỗ).
 * Dùng thống nhất cho toàn hệ thống thay ActivityIndicator.
 */
export function LoadingSpinner({
  size = 24,
  color = COLORS.primary,
  style,
}: LoadingSpinnerProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [progress]);

  const viewBoxSize = 24;

  const animatedProps1 = useAnimatedProps(() => {
    const cx = interpolate(progress.value, [0, 0.5, 1], [4, 9, 4]);
    const r = interpolate(progress.value, [0, 0.5, 1], [3, 8, 3]);
    return { cx, cy: 12, r };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const cx = interpolate(progress.value, [0, 0.5, 1], [15, 20, 15]);
    const r = interpolate(progress.value, [0, 0.5, 1], [8, 3, 8]);
    return { cx, cy: 12, r };
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <AnimatedCircle animatedProps={animatedProps1} fill={color} />
        <AnimatedCircle animatedProps={animatedProps2} fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
