import type { QuizAnswer, QuizResult, Word } from '@/types/models';
import { todayKey } from '@/utils/date';
import { createId } from '@/utils/id';

export type QuizQuestion = {
  wordId: string;
  term: string;
  definitionEn: string;
  meaningEs: string;
  options: string[];
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function buildQuizQuestions(
  words: Word[],
  savedWords: Word[],
  count = 5,
): QuizQuestion[] {
  const savedIds = new Set(savedWords.map((word) => word.id));
  const prioritized = shuffle(words.filter((word) => savedIds.has(word.id)));
  const remaining = shuffle(words.filter((word) => !savedIds.has(word.id)));
  const selected = [...prioritized, ...remaining].slice(0, Math.min(count, words.length));

  return selected.map((word) => {
    const distractors = shuffle(words.filter((entry) => entry.id !== word.id))
      .slice(0, 3)
      .map((entry) => entry.term);

    return {
      wordId: word.id,
      term: word.term,
      definitionEn: word.definitionEn,
      meaningEs: word.meaningEs,
      options: shuffle([word.term, ...distractors]),
    };
  });
}

export function createQuizResult(answers: QuizAnswer[]): QuizResult {
  return {
    id: createId('quiz'),
    date: todayKey(),
    completedAt: new Date().toISOString(),
    totalQuestions: answers.length,
    correctAnswers: answers.filter((answer) => answer.isCorrect).length,
    answers,
  };
}
