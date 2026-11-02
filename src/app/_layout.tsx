import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { LoadingScreen } from '@/components/loading-screen';
import { AppProvider, useAppState } from '@/context/AppProvider';
import { colors } from '@/theme';

function RootNavigator() {
  const { state, isHydrated } = useAppState();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const inOnboarding = segments[0] === 'onboarding';

    if (!state.profile && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (state.profile && inOnboarding) {
      router.replace('/');
    }
  }, [isHydrated, router, segments, state.profile]);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="settings" options={{ title: 'Ajustes' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
