import { AppScreen, InfoCard } from '@/components/app-screen';

import { ThemedText } from '@/components/themed-text';

export default function ProgressScreen() {
  return (
    <AppScreen
      eyebrow="Seguimiento"
      title="Tu progreso"
      description="Una vista sencilla para reconocer la constancia y detectar qué practicar después.">
      <InfoCard>
        <ThemedText type="smallBold" themeColor="primary">
          PRÓXIMAMENTE
        </ThemedText>
        <ThemedText>
          La racha, las palabras aprendidas y la evolución de tus ensayos aparecerán cuando las
          actividades estén disponibles.
        </ThemedText>
      </InfoCard>
    </AppScreen>
  );
}
