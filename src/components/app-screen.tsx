import { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type AppScreenProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description: string;
}>;

export function AppScreen({ eyebrow, title, description, children }: AppScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.five },
          ]}>
          {eyebrow && (
            <ThemedText type="smallBold" themeColor="primary" style={styles.eyebrow}>
              {eyebrow}
            </ThemedText>
          )}
          <ThemedText type="title">{title}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {description}
          </ThemedText>
          {children}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

export function InfoCard({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <ThemedView type="surface" style={[styles.card, { borderColor: theme.border }]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  eyebrow: {
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
  },
  card: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
