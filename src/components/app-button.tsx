import { Pressable, type PressableProps, type ViewStyle } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  danger: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
};

const variantTextColors = {
  primary: 'primaryText',
  secondary: 'text',
  danger: 'danger',
  ghost: 'primary',
} as const;

export function AppButton({
  label,
  variant = 'primary',
  fullWidth = true,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: radius.md,
          borderWidth: 1,
          paddingHorizontal: spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
        variantStyles[variant],
        style,
      ]}
      {...rest}>
      <AppText variant="bodyStrong" color={variantTextColors[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
}
