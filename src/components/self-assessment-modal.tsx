import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { guideQuestions } from '@/data/seed';
import { colors, radius, spacing } from '@/theme';
import type { CriterionScore, WritingCriterion, WritingScores } from '@/types/models';
import { averageWritingScores, formatBand } from '@/utils/band';

export type ScoreState = Record<WritingCriterion, CriterionScore | null>;

type SelfAssessmentModalProps = {
  visible: boolean;
  wordCount: number;
  scores: ScoreState;
  onChangeScore: (criterion: WritingCriterion, score: CriterionScore) => void;
  onClose: () => void;
  onSave: () => void;
};

const SCORES: CriterionScore[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SelfAssessmentModal({
  visible,
  wordCount,
  scores,
  onChangeScore,
  onClose,
  onSave,
}: SelfAssessmentModalProps) {
  const values = Object.values(scores);
  const complete = values.every((value) => value !== null);
  const average = complete ? averageWritingScores(scores as WritingScores) : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            maxHeight: '94%',
            backgroundColor: colors.background,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
            }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <AppText variant="heading">Autoevaluación</AppText>
              <AppText variant="small" color="textSecondary">
                {wordCount} palabras · 4 criterios
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar autoevaluación"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.surface,
                opacity: pressed ? 0.7 : 1,
              })}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.xl,
              paddingBottom: spacing.xl,
              gap: spacing.xl,
            }}>
            {wordCount < 250 ? (
              <View
                style={{
                  backgroundColor: colors.warningSoft,
                  borderRadius: radius.md,
                  padding: spacing.md,
                }}>
                <AppText variant="smallStrong" color="warningText">
                  Tu ensayo tiene {wordCount} palabras. El mínimo recomendado es 250.
                </AppText>
              </View>
            ) : null}

            {guideQuestions.map((criterion) => (
              <View key={criterion.id} style={{ gap: spacing.sm }}>
                <AppText variant="subtitle">{criterion.criterionLabelEn}</AppText>
                <AppText variant="small" color="textSecondary">
                  {criterion.questionEs}
                </AppText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
                  {SCORES.map((score) => {
                    const selected = scores[criterion.id] === score;

                    return (
                      <Pressable
                        key={score}
                        accessibilityRole="radio"
                        accessibilityLabel={`${criterion.criterionLabelEn}: ${score}`}
                        accessibilityState={{ selected }}
                        onPress={() => onChangeScore(criterion.id, score)}
                        style={({ pressed }) => ({
                          width: '18%',
                          minHeight: 44,
                          borderRadius: radius.sm,
                          borderWidth: 1,
                          borderColor: selected ? colors.primary : colors.border,
                          backgroundColor: selected ? colors.primary : colors.surface,
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: pressed ? 0.8 : 1,
                        })}>
                        <AppText
                          variant="bodyStrong"
                          color={selected ? 'white' : 'text'}>
                          {score}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}

            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                padding: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.md,
              }}>
              <View style={{ gap: spacing.xs }}>
                <AppText variant="small" color="white" style={{ opacity: 0.85 }}>
                  Banda estimada
                </AppText>
                <AppText variant="display" color="white">
                  {average !== null ? formatBand(average) : '—'}
                </AppText>
              </View>
              <AppText
                variant="small"
                color="white"
                style={{ opacity: 0.85, flex: 1 }}
                align="right">
                Resultado orientativo. No reemplaza una calificación oficial.
              </AppText>
            </View>
          </ScrollView>

          <View
            style={{
              paddingHorizontal: spacing.xl,
              paddingBottom: spacing.lg,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            }}>
            <AppButton
              label="Guardar ensayo"
              onPress={onSave}
              disabled={!complete}
            />
            {!complete ? (
              <AppText
                variant="small"
                color="textMuted"
                align="center"
                style={{ marginTop: spacing.sm }}>
                Selecciona una puntuación en los cuatro criterios.
              </AppText>
            ) : null}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
