import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Pill } from '@/components/pill';
import { Screen } from '@/components/screen';
import { writingPrompts } from '@/data/seed';
import { colors, radius, spacing } from '@/theme';

const STEPS = [
  { icon: 'timer-outline' as const, text: '40 minutos de escritura' },
  { icon: 'document-text-outline' as const, text: 'Mínimo 250 palabras' },
  { icon: 'clipboard-outline' as const, text: 'Autoevaluación en 4 criterios' },
];

export default function WritingScreen() {
  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">Writing</AppText>
        <AppText color="textSecondary">
          Practica Task 2 en condiciones de examen y revisa tu respuesta.
        </AppText>
      </View>

      <Card style={{ gap: spacing.md }}>
        <AppText variant="subtitle">Cómo funciona</AppText>
        {STEPS.map((step) => (
          <View
            key={step.text}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radius.pill,
                backgroundColor: colors.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={step.icon} size={18} color={colors.primary} />
            </View>
            <AppText variant="small" color="textSecondary" style={{ flex: 1 }}>
              {step.text}
            </AppText>
          </View>
        ))}
      </Card>

      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText variant="heading">Temas de práctica</AppText>
          <AppText variant="smallStrong" color="textSecondary">
            {writingPrompts.length} temas
          </AppText>
        </View>

        <View style={{ gap: spacing.md }}>
          {writingPrompts.map((prompt) => (
            <Card key={prompt.id} style={{ gap: spacing.sm }}>
              <Pill label={prompt.category} tone="primary" />
              <AppText variant="bodyStrong">{prompt.title}</AppText>
              <AppText variant="small" color="textSecondary">
                {prompt.question}
              </AppText>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}
