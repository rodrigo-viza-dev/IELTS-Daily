import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { IconButton } from '@/components/icon-button';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import {
  SelfAssessmentModal,
  type ScoreState,
} from '@/components/self-assessment-modal';
import { useAppState } from '@/context/AppProvider';
import { writingPrompts } from '@/data/seed';
import { colors, radius, spacing, typography } from '@/theme';
import type { CriterionScore, WritingCriterion, WritingScores } from '@/types/models';
import { averageWritingScores } from '@/utils/band';
import { todayKey } from '@/utils/date';
import { createId } from '@/utils/id';

const EXAM_SECONDS = 40 * 60;
const MIN_WORDS = 250;
const EMPTY_SCORES: ScoreState = {
  taskResponse: null,
  coherenceAndCohesion: null,
  lexicalResource: null,
  grammaticalRangeAndAccuracy: null,
};

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function WritingEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prompt = writingPrompts.find((entry) => entry.id === id);
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const existingDraft = state.essays.find(
    (essay) => essay.promptId === id && essay.completedAt === null,
  );

  const [essayId] = useState(() => existingDraft?.id ?? createId('essay'));
  const [body, setBody] = useState(existingDraft?.body ?? '');
  const [startedAt] = useState(existingDraft?.startedAt ?? new Date().toISOString());
  const [elapsedBase, setElapsedBase] = useState(existingDraft?.elapsedSeconds ?? 0);
  const [runningSince, setRunningSince] = useState<number | null>(null);
  const [tick, setTick] = useState(() => Date.now());
  const [reviewVisible, setReviewVisible] = useState(false);
  const [scores, setScores] = useState<ScoreState>(EMPTY_SCORES);
  const completedRef = useRef(false);
  const draftRef = useRef({ body, elapsed: 0, wordCount: 0 });

  const wordCount = countWords(body);
  const liveElapsed = Math.min(
    EXAM_SECONDS,
    runningSince === null ? elapsedBase : elapsedBase + (tick - runningSince) / 1000,
  );
  const elapsed = Math.floor(liveElapsed);
  const remaining = Math.max(0, EXAM_SECONDS - elapsed);

  useEffect(() => {
    draftRef.current = { body, elapsed, wordCount };
  }, [body, elapsed, wordCount]);

  const persistDraft = useCallback(
    (elapsedOverride?: number) => {
      if (!prompt || completedRef.current) {
        return;
      }

      const latest = draftRef.current;
      const elapsedValue = elapsedOverride ?? latest.elapsed;

      if (latest.body.trim().length === 0 && elapsedValue === 0) {
        return;
      }

      dispatch({
        type: 'save-essay',
        date: todayKey(),
        essay: {
          id: essayId,
          promptId: prompt.id,
          body: latest.body,
          wordCount: latest.wordCount,
          startedAt,
          updatedAt: new Date().toISOString(),
          completedAt: null,
          elapsedSeconds: Math.floor(elapsedValue),
          scores: null,
          overallBand: null,
        },
      });
    },
    [dispatch, essayId, prompt, startedAt],
  );

  useEffect(() => {
    if (runningSince === null) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setTick(now);

      if (elapsedBase + (now - runningSince) / 1000 >= EXAM_SECONDS) {
        setElapsedBase(EXAM_SECONDS);
        setRunningSince(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedBase, runningSince]);

  useEffect(() => {
    const timeout = setTimeout(() => persistDraft(), 700);
    return () => clearTimeout(timeout);
  }, [body, persistDraft]);

  useEffect(() => {
    return () => persistDraft();
  }, [persistDraft]);

  if (!prompt) {
    return (
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconButton
            icon="chevron-back"
            label="Volver"
            onPress={() => router.replace('/writing')}
          />
          <AppText variant="heading">Tema no encontrado</AppText>
        </View>
        <Card>
          <AppText variant="small" color="textSecondary">
            Vuelve a la lista de temas y elige una consigna disponible.
          </AppText>
        </Card>
      </Screen>
    );
  }

  const pauseTimer = () => {
    if (runningSince === null) {
      return;
    }

    const next = Math.min(EXAM_SECONDS, elapsedBase + (Date.now() - runningSince) / 1000);
    setElapsedBase(next);
    setRunningSince(null);
    persistDraft(next);
  };

  const toggleTimer = () => {
    if (runningSince !== null) {
      pauseTimer();
      return;
    }

    if (remaining <= 0) {
      return;
    }

    const now = Date.now();
    setTick(now);
    setRunningSince(now);
  };

  const openReview = () => {
    pauseTimer();
    setReviewVisible(true);
  };

  const handleSave = () => {
    const values = Object.values(scores);

    if (!prompt || values.some((value) => value === null)) {
      return;
    }

    const finalScores = scores as WritingScores;
    const now = new Date().toISOString();
    completedRef.current = true;

    dispatch({
      type: 'save-essay',
      date: todayKey(),
      essay: {
        id: essayId,
        promptId: prompt.id,
        body,
        wordCount,
        startedAt,
        updatedAt: now,
        completedAt: now,
        elapsedSeconds: elapsed,
        scores: finalScores,
        overallBand: averageWritingScores(finalScores),
      },
    });

    setReviewVisible(false);
    router.replace('/progress');
  };

  const timerLabel =
    remaining <= 0
      ? 'Tiempo agotado'
      : runningSince !== null
        ? 'Pausar'
        : elapsed > 0
          ? 'Reanudar'
          : 'Iniciar';

  return (
    <>
      <Screen
        footer={
          <View style={{ gap: spacing.sm }}>
            <AppButton
              label="Terminar y autoevaluar"
              onPress={openReview}
              disabled={wordCount === 0}
            />
            {wordCount === 0 ? (
              <AppText variant="small" color="textMuted" align="center">
                Escribe al menos una palabra para continuar.
              </AppText>
            ) : null}
          </View>
        }>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconButton
            icon="chevron-back"
            label="Volver a Writing"
            onPress={() => {
              pauseTimer();
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/writing');
              }
            }}
          />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">Writing Task 2</AppText>
            <AppText variant="small" color="textSecondary">
              {prompt.category}
            </AppText>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.surfaceMuted,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.sm,
          }}>
          <AppText variant="smallStrong" color="textSecondary">
            {prompt.title}
          </AppText>
          <AppText variant="body">{prompt.question}</AppText>
        </View>

        <Card style={{ gap: spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: spacing.md,
            }}>
            <View style={{ gap: spacing.xs }}>
              <AppText variant="caption" color="textMuted">
                TIEMPO RESTANTE
              </AppText>
              <AppText
                variant="display"
                color={remaining <= 300 ? 'warningText' : 'text'}
                style={{ fontSize: 46, lineHeight: 50 }}>
                {formatSeconds(remaining)}
              </AppText>
            </View>
            <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
              <AppText variant="caption" color="textMuted">
                PALABRAS
              </AppText>
              <AppText
                variant="heading"
                color={wordCount >= MIN_WORDS ? 'successText' : 'text'}>
                {wordCount} / {MIN_WORDS}
              </AppText>
            </View>
          </View>

          <ProgressBar
            value={Math.min(1, wordCount / MIN_WORDS)}
            color={wordCount >= MIN_WORDS ? colors.success : colors.primary}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <AppButton
              label={timerLabel}
              variant="secondary"
              fullWidth={false}
              onPress={toggleTimer}
              disabled={remaining <= 0}
            />
            <AppText variant="small" color="textSecondary" style={{ flex: 1 }}>
              {runningSince !== null
                ? 'El temporizador está en marcha.'
                : elapsed > 0
                  ? 'Puedes reanudar cuando quieras.'
                  : 'Inicia cuando estés listo para escribir.'}
            </AppText>
          </View>
        </Card>

        <TextInput
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          placeholder="Escribe tu ensayo en inglés..."
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Editor del ensayo"
          style={{
            minHeight: 300,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.lg,
            padding: spacing.lg,
            ...typography.body,
            color: colors.text,
          }}
        />

        {wordCount > 0 && wordCount < MIN_WORDS ? (
          <View
            style={{
              backgroundColor: colors.warningSoft,
              borderRadius: radius.md,
              padding: spacing.md,
            }}>
            <AppText variant="smallStrong" color="warningText">
              Faltan {MIN_WORDS - wordCount} palabras para el mínimo recomendado.
              Puedes continuar cuando quieras.
            </AppText>
          </View>
        ) : null}

        <AppText variant="small" color="textMuted">
          El borrador se guarda en este dispositivo automáticamente.
        </AppText>
      </Screen>

      <SelfAssessmentModal
        visible={reviewVisible}
        wordCount={wordCount}
        scores={scores}
        onChangeScore={(criterion: WritingCriterion, score: CriterionScore) =>
          setScores((current) => ({ ...current, [criterion]: score }))
        }
        onClose={() => setReviewVisible(false)}
        onSave={handleSave}
      />
    </>
  );
}
