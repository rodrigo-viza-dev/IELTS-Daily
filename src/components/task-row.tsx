import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, spacing } from '@/theme';

type TaskRowProps = {
  title: string;
  subtitle: string;
  done: boolean;
  onPress: () => void;
};

export function TaskRow({ title, subtitle, done, onPress }: TaskRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${done ? 'Completada' : 'Pendiente'}`}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        opacity: pressed ? 0.78 : 1,
      })}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: radius.pill,
          borderWidth: done ? 0 : 1.5,
          borderColor: colors.borderStrong,
          backgroundColor: done ? colors.success : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {done ? <Ionicons name="checkmark" size={18} color={colors.white} /> : null}
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText variant="small" color="textSecondary">
          {subtitle}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}
