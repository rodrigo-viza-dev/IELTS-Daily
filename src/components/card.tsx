import { View, type ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

type CardProps = ViewProps & {
  padded?: boolean;
};

export function Card({ style, padded = true, ...rest }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: padded ? spacing.lg : 0,
          gap: spacing.sm,
        },
        shadows.card,
        style,
      ]}
      {...rest}
    />
  );
}
