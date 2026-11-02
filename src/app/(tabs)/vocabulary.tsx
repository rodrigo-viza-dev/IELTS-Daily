import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Pill } from '@/components/pill';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import { todayKey } from '@/utils/date';
import { getWordOfDay } from '@/utils/word-of-day';

export default function VocabularyScreen() {
  const { state, dispatch } = useAppState();
  const today = todayKey();
  const word = getWordOfDay(state.words, today);
  const savedWords = state.words.filter((entry) => entry.isSaved);

  const toggleSaved = () => {
    if (!word) {
      return;
    }

    dispatch({
      type: 'toggle-word-saved',
      wordId: word.id,
      date: today,
      at: new Date().toISOString(),
    });
  };

  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="title">Vocabulario</AppText>
        <AppText color="textSecondary">
          Una palabra académica al día, con significado y ejemplo.
        </AppText>
      </View>

      {word ? (
        <View
          style={{
            backgroundColor: colors.primarySoft,
            borderRadius: radius.xl,
            padding: spacing.xl,
            gap: spacing.sm,
          }}>
          <AppText variant="caption" color="primary">
            PALABRA DEL DÍA
          </AppText>
          <AppText variant="display" color="primary" style={{ fontSize: 36, lineHeight: 42 }}>
            {word.term}
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <Pill label={word.category} tone="primary" />
            <Pill label={word.partOfSpeech} />
          </View>
          <AppText variant="body">{word.definitionEn}</AppText>
          <AppText variant="small" color="textSecondary">
            Español: {word.meaningEs}
          </AppText>
          <AppText
            variant="small"
            color="textSecondary"
            style={{ fontStyle: 'italic' }}>
            “{word.exampleEn}”
          </AppText>
          <View style={{ marginTop: spacing.sm }}>
            <AppButton
              label={word.isSaved ? 'Quitar de mis palabras' : 'Guardar palabra'}
              variant={word.isSaved ? 'secondary' : 'primary'}
              onPress={toggleSaved}
            />
          </View>
        </View>
      ) : (
        <Card>
          <AppText variant="subtitle">No hay palabras disponibles</AppText>
          <AppText variant="small" color="textSecondary">
            El banco local de vocabulario está vacío.
          </AppText>
        </Card>
      )}

      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <AppText variant="heading">Mis palabras</AppText>
          <AppText variant="smallStrong" color="textSecondary">
            {savedWords.length} guardadas
          </AppText>
        </View>

        {savedWords.length === 0 ? (
          <Card style={{ alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="bookmark-outline" size={26} color={colors.textMuted} />
            <AppText variant="bodyStrong" align="center">
              Aún no has guardado palabras
            </AppText>
            <AppText variant="small" color="textSecondary" align="center">
              Guarda la palabra del día para empezar tu lista personal.
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {savedWords.map((entry) => (
              <Card key={entry.id} style={{ gap: spacing.xs }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: spacing.sm,
                  }}>
                  <AppText variant="bodyStrong">{entry.term}</AppText>
                  <Pill
                    label={
                      entry.status === 'mastered'
                        ? 'Dominada'
                        : entry.status === 'review'
                          ? 'En repaso'
                          : 'Nueva'
                    }
                    tone={
                      entry.status === 'mastered'
                        ? 'success'
                        : entry.status === 'review'
                          ? 'warning'
                          : 'neutral'
                    }
                  />
                </View>
                <AppText variant="small" color="textSecondary">
                  {entry.meaningEs}
                </AppText>
              </Card>
            ))}
          </View>
        )}
      </View>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.pill,
            backgroundColor: colors.surfaceSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="subtitle">Quiz de repaso</AppText>
          <AppText variant="small" color="textSecondary">
            La ronda de 5 preguntas se habilitará en la siguiente fase.
          </AppText>
        </View>
      </Card>
    </Screen>
  );
}
