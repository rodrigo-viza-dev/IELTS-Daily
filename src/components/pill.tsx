import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, spacing, type AppColor } from '@/theme';

type PillTone = 'primary' | 'success' | 'warning' | 'neutral';

type PillProps = {
  label: string;
  tone?: PillTone;
};

const toneStyles: Record<PillTone, { backgroundColor: string; color: AppColor }> = {
  primary: { backgroundColor: colors.primarySoft, color: 'primary' },
  success: { backgroundColor: colors.successSoft, color: 'successText' },
  warning: { backgroundColor: colors.warningSoft, color: 'warningText' },
  neutral: { backgroundColor: colors.surfaceMuted, color: 'textSecondary' },
};

export function Pill({ label, tone = 'neutral' }: PillProps) {
  const style = toneStyles[tone];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
        backgroundColor: style.backgroundColor,
      }}>
      <AppText variant="caption" color={style.color}>
        {label}
      </AppText>
    </View>
  );
}
