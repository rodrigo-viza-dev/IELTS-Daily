import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { spacing } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}>
      {onBack ? (
        <IconButton icon="chevron-back" label="Volver" onPress={onBack} />
      ) : null}
      <View style={{ flex: 1, gap: spacing.xs }}>
        <AppText variant="heading">{title}</AppText>
        {subtitle ? (
          <AppText variant="small" color="textSecondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}
