import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, spacing } from '@/theme';

export function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: colors.background,
      }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText color="textSecondary">Cargando tus datos...</AppText>
    </View>
  );
}
