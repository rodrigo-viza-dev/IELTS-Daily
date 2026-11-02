import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Pill } from '@/components/pill';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { writingPrompts } from '@/data/seed';
import { colors, radius, spacing } from '@/theme';

const STEPS = [
  { icon: 'timer-outline' as const, text: '40 minutos de escritura' },
  { icon: 'document-text-outline' as const, text: 'Mínimo 250 palabras' },
  { icon: 'clipboard-outline' as const, text: 'Autoevaluación en 4 criterios' },
];

export default function WritingScreen() {
  const { state } = useAppState();
  const router = useRouter();
  const drafts = state.essays.filter(
    (essay) => essay.completedAt === null && essay.body.trim().length > 0,
  );

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
          {writingPrompts.map((prompt) => {
            const hasDraft = drafts.some((essay) => essay.promptId === prompt.id);

            return (
              <Pressable
                key={prompt.id}
                accessibilityRole="button"
                accessibilityLabel={`Escribir sobre ${prompt.title}`}
                onPress={() => router.push(`/writing/${prompt.id}`)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                <Card style={{ gap: spacing.sm }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.sm,
                    }}>
                    <Pill label={prompt.category} tone="primary" />
                    {hasDraft ? <Pill label="Borrador" tone="warning" /> : null}
                  </View>
                  <AppText variant="bodyStrong">{prompt.title}</AppText>
                  <AppText variant="small" color="textSecondary">
                    {prompt.question}
                  </AppText>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: spacing.xs,
                    }}>
                    <AppText variant="smallStrong" color="primary">
                      Escribir
                    </AppText>
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}
