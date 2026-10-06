import { AppScreen, InfoCard } from '@/components/app-screen';
import { writingPrompts } from '@/data/seed';

import { ThemedText } from '@/components/themed-text';

export default function WritingScreen() {
  return (
    <AppScreen
      eyebrow="Writing Task 2"
      title="Escribe con intención."
      description="Practica respuestas en inglés con tiempo limitado y una autoevaluación orientativa.">
      <InfoCard>
        <ThemedText type="smallBold" themeColor="primary">
          TEMAS DISPONIBLES
        </ThemedText>
        <ThemedText>
          Hay {writingPrompts.length} consignas originales. El editor, el temporizador y los
          criterios se incorporarán en la fase de Writing.
        </ThemedText>
      </InfoCard>
    </AppScreen>
  );
}
