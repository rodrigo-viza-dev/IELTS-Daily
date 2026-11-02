import { View } from 'react-native';

import { colors, radius } from '@/theme';

type ProgressBarProps = {
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
};

export function ProgressBar({
  value,
  height = 6,
  color = colors.primary,
  trackColor = colors.border,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{
        height,
        borderRadius: radius.pill,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: radius.pill,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
