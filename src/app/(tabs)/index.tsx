import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { AppScreen, InfoCard } from '@/components/app-screen';
import { Radius, Spacing } from '@/constants/theme';
import { writingPrompts } from '@/data/seed';
import { useAppState } from '@/context/AppProvider';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  const { isHydrated, state } = useAppState();
  const theme = useTheme();

  return (
    <AppScreen
      eyebrow="IELTS Daily"
      title="Tu práctica, un día a la vez."
      description="Una base ligera para estudiar vocabulario, escribir y revisar tu avance sin depender de internet.">
      <InfoCard>
        <ThemedText type="smallBold" themeColor="primary">
          BASE LOCAL
        </ThemedText>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          {isHydrated ? `${state.words.length} palabras listas` : 'Cargando tus datos...'}
        </ThemedText>
        <ThemedText themeColor="textSecondary">
          {writingPrompts.length} temas originales de Writing Task 2 te esperan en la app.
        </ThemedText>
      </InfoCard>

      <Link href="/settings" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            { borderColor: theme.border },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" themeColor="primary">
            Abrir ajustes
          </ThemedText>
          <ThemedText themeColor="textSecondary">Preferencias y datos locales</ThemedText>
        </Pressable>
      </Link>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 26,
    lineHeight: 32,
  },
  settingsButton: {
    borderRadius: Radius.medium,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.72,
  },
});
