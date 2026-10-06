import { AppScreen, InfoCard } from '@/components/app-screen';
import { wordSeeds } from '@/data/seed';

import { ThemedText } from '@/components/themed-text';

export default function VocabularyScreen() {
  return (
    <AppScreen
      eyebrow="Práctica"
      title="Vocabulario"
      description="Guarda palabras académicas y repásalas con ejemplos breves en inglés.">
      <InfoCard>
        <ThemedText type="smallBold" themeColor="primary">
          CONTENIDO PREPARADO
        </ThemedText>
        <ThemedText>
          La primera colección incluye {wordSeeds.length} palabras. La lista y los estados de
          repaso se implementarán en la siguiente fase.
        </ThemedText>
      </InfoCard>
    </AppScreen>
  );
}
