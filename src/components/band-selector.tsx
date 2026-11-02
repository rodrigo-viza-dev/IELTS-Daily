import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, spacing } from '@/theme';
import type { TargetBand } from '@/types/models';
import { TARGET_BANDS, formatBand } from '@/utils/band';

type BandSelectorProps = {
  value: TargetBand;
  onChange: (band: TargetBand) => void;
};

export function BandSelector({ value, onChange }: BandSelectorProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {TARGET_BANDS.map((band) => {
        const selected = band === value;

        return (
          <Pressable
            key={band}
            accessibilityRole="radio"
            accessibilityLabel={`Banda objetivo ${formatBand(band)}`}
            accessibilityState={{ selected }}
            onPress={() => onChange(band)}
            style={({ pressed }) => ({
              width: '30%',
              minHeight: 52,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected ? colors.primarySoft : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <AppText
              variant="bodyStrong"
              color={selected ? 'primary' : 'text'}>
              {formatBand(band)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
