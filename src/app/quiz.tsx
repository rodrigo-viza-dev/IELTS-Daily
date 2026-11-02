import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { IconButton } from '@/components/icon-button';
import { Pill } from '@/components/pill';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { useAppState } from '@/context/AppProvider';
import { colors, radius, spacing } from '@/theme';
import type { QuizAnswer } from '@/types/models';
import { buildQuizQuestions, createQuizResult, type QuizQuestion } from '@/utils/quiz';

export default function QuizScreen() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const savedWords = state.words.filter((word) => word.isSaved);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildQuizQuestions(state.words, savedWords),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);

  const correctSoFar = answers.filter((answer) => answer.isCorrect).length;
  const question = questions[index];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/vocabulary');
    }
  };

  const handleSelect = (option: string) => {
    if (!question || selected !== null || answers.length > index) {
      return;
    }

    setSelected(option);
    setAnswers((current) => [
      ...current,
      { wordId: question.wordId, isCorrect: option === question.term },
    ]);
  };

  const handleNext = () => {
    if (finished || finishedRef.current || !question) {
      return;
    }

    if (index < questions.length - 1) {
      setIndex((current) => current + 1);
      setSelected(null);
      return;
    }

    finishedRef.current = true;
    dispatch({ type: 'record-quiz', result: createQuizResult(answers) });
    setFinished(true);
  };

  const restart = () => {
    setQuestions(buildQuizQuestions(state.words, savedWords));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    finishedRef.current = false;
  };

  if (questions.length < 4) {
    return (
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconButton icon="chevron-back" label="Volver" onPress={goBack} />
          <AppText variant="heading">Quiz de repaso</AppText>
        </View>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.xl,
            gap: spacing.sm,
          }}>
          <AppText variant="subtitle">Aún no hay suficientes palabras</AppText>
          <AppText variant="small" color="textSecondary">
            El banco local necesita al menos cuatro palabras para crear una ronda.
          </AppText>
        </View>
      </Screen>
    );
  }

  if (finished) {
    const total = questions.length;
    const message =
      correctSoFar === total
        ? 'Ronda perfecta. Sigue repasando para mantener el ritmo.'
        : correctSoFar >= 3
          ? 'Buen repaso. Revisa las palabras falladas en tu lista.'
          : 'Sigue practicando: cada ronda suma constancia.';

    return (
      <Screen
        footer={
          <View style={{ gap: spacing.md }}>
            <AppButton label="Repetir quiz" onPress={restart} />
            <AppButton
              label="Volver a Vocabulario"
              variant="secondary"
              onPress={() => router.replace('/vocabulary')}
            />
          </View>
        }>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <IconButton icon="chevron-back" label="Volver" onPress={goBack} />
          <AppText variant="heading">Resultado</AppText>
        </View>

        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.xl,
            padding: spacing.xl,
            alignItems: 'center',
            gap: spacing.sm,
          }}>
          <AppText variant="small" color="white" style={{ opacity: 0.85 }}>
            Aciertos
          </AppText>
          <AppText
            variant="display"
            color="white"
            style={{ fontSize: 64, lineHeight: 68 }}>
            {correctSoFar}
          </AppText>
          <AppText variant="bodyStrong" color="white">
            de {total} preguntas
          </AppText>
        </View>

        <AppText color="textSecondary" align="center">
          {message}
        </AppText>
      </Screen>
    );
  }

  const isCorrect = selected !== null && selected === question.term;

  return (
    <Screen
      footer={
        <AppButton
          label={index === questions.length - 1 ? 'Ver resultado' : 'Siguiente'}
          onPress={handleNext}
          disabled={selected === null}
        />
      }>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconButton icon="chevron-back" label="Volver" onPress={goBack} />
        <View style={{ flex: 1 }}>
          <AppText variant="heading">Quiz de repaso</AppText>
        </View>
        <Pill label={`${correctSoFar} aciertos`} tone={correctSoFar > 0 ? 'success' : 'neutral'} />
      </View>

      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText variant="small" color="textSecondary">
            Pregunta {index + 1} de {questions.length}
          </AppText>
          <AppText variant="small" color="textSecondary">
            {savedWords.length >= questions.length ? 'Tus palabras' : 'Banco local'}
          </AppText>
        </View>
        <ProgressBar value={(index + 1) / questions.length} />
      </View>

      <AppText variant="title" style={{ fontSize: 26, lineHeight: 32 }}>
        Which word means “{question.definitionEn}”?
      </AppText>

      <View style={{ gap: spacing.md }}>
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isRight = option === question.term;
          const revealed = selected !== null;
          const backgroundColor = revealed
            ? isRight
              ? colors.successSoft
              : isSelected
                ? colors.dangerSoft
                : colors.surface
            : colors.surface;
          const borderColor = revealed
            ? isRight
              ? colors.success
              : isSelected
                ? colors.danger
                : colors.border
            : colors.border;

          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={option}
              accessibilityState={{ selected: isSelected }}
              disabled={revealed}
              onPress={() => handleSelect(option)}
              style={({ pressed }) => ({
                minHeight: 56,
                justifyContent: 'center',
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor,
                backgroundColor,
                opacity: pressed ? 0.8 : 1,
              })}>
              <AppText
                variant="bodyStrong"
                color={revealed && isRight ? 'successText' : 'text'}>
                {option}
                {revealed && isRight ? ' ✓' : ''}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <View
          style={{
            backgroundColor: isCorrect ? colors.successSoft : colors.dangerSoft,
            borderRadius: radius.md,
            padding: spacing.lg,
            gap: spacing.xs,
          }}>
          <AppText
            variant="subtitle"
            color={isCorrect ? 'successText' : 'dangerText'}>
            {isCorrect ? 'Correcto' : 'Incorrecto'}
          </AppText>
          <AppText variant="small" color="textSecondary">
            “{question.term}” significa {question.meaningEs}.
          </AppText>
        </View>
      ) : null}
    </Screen>
  );
}
