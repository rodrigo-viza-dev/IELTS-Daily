import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable } from 'react-native';

import { colors, layout, radius } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type IconButtonProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
};

export function IconButton({
  icon,
  label,
  onPress,
  color = colors.text,
  backgroundColor = colors.surface,
  disabled,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => ({
        width: layout.minTouchTarget,
        height: layout.minTouchTarget,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
      })}>
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
  );
}
