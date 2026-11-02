import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, layout, radius, spacing, typography } from '@/theme';

type DateInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  hasError?: boolean;
  placeholder?: string;
};

function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter((part) => part.length > 0).join('/');
}

export function DateInput({
  value,
  onChangeText,
  onClear,
  hasError,
  placeholder = 'DD/MM/AAAA',
}: DateInputProps) {
  return (
    <View
      style={[
        styles.container,
        { borderColor: hasError ? colors.danger : colors.border },
      ]}>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(formatDateInput(text))}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={10}
        accessibilityLabel="Fecha del examen"
        style={styles.input}
      />
      {value.length > 0 && onClear ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quitar fecha"
          hitSlop={8}
          onPress={onClear}
          style={({ pressed }) => [
            styles.clearButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}>
          <AppText variant="smallStrong" color="primary">
            Quitar
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
});
