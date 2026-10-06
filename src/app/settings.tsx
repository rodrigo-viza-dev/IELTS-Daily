import { AppScreen, InfoCard } from '@/components/app-screen';
import { useAppState } from '@/context/AppProvider';

import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  const { isHydrated } = useAppState();

  return (
    <AppScreen
      eyebrow="Preferencias"
      title="Ajustes"
      description="La configuración de banda, fecha de examen y recordatorios se añadirá en la fase de onboarding.">
      <InfoCard>
        <ThemedText type="smallBold" themeColor="primary">
          ALMACENAMIENTO LOCAL
        </ThemedText>
        <ThemedText>
          {isHydrated
            ? 'Tus datos están listos para guardarse en este dispositivo.'
            : 'Cargando el almacenamiento local...'}
        </ThemedText>
      </InfoCard>
    </AppScreen>
  );
}
