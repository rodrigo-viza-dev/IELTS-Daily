import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  vocabulary: { active: 'book', inactive: 'book-outline' },
  writing: { active: 'create', inactive: 'create-outline' },
  progress: { active: 'stats-chart', inactive: 'stats-chart-outline' },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, focused }) => {
          const icons = TAB_ICONS[route.name] ?? TAB_ICONS.index;
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={22}
              color={color}
            />
          );
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="vocabulary" options={{ title: 'Vocabulario' }} />
      <Tabs.Screen name="writing" options={{ title: 'Writing' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progreso' }} />
    </Tabs>
  );
}
