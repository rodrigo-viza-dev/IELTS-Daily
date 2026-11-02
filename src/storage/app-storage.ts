import AsyncStorage from '@react-native-async-storage/async-storage';

import { wordSeeds } from '@/data/seed';
import type {
  AppState,
  BandScore,
  CriterionScore,
  DailyActivity,
  Essay,
  Profile,
  QuizAnswer,
  QuizResult,
  Word,
  WordStatus,
  WritingScores,
} from '@/types/models';
import { isTargetBand } from '@/utils/band';
import { isValidLocalDateKey } from '@/utils/date';

import { APP_STATE_STORAGE_KEY, LEGACY_APP_STATE_STORAGE_KEY } from './keys';

export const APP_STATE_SCHEMA_VERSION = 2;

export function createInitialAppState(): AppState {
  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    profile: null,
    words: wordSeeds.map((word) => ({
      ...word,
      isSaved: false,
      status: 'new',
      reviewCount: 0,
      lastReviewedAt: null,
    })),
    quizResults: [],
    essays: [],
    dailyActivities: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isWordStatus(value: unknown): value is WordStatus {
  return value === 'new' || value === 'review' || value === 'mastered';
}

function isCriterionScore(value: unknown): value is CriterionScore {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 9;
}

function parseProfile(value: unknown): Profile | null {
  if (!isRecord(value) || !isTargetBand(value.targetBand)) {
    return null;
  }

  const examDate =
    typeof value.examDate === 'string' && isValidLocalDateKey(value.examDate)
      ? value.examDate
      : null;

  const reminderTime =
    typeof value.reminderTime === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value.reminderTime)
      ? value.reminderTime
      : '20:00';

  const fallbackTimestamp = new Date().toISOString();

  return {
    targetBand: value.targetBand,
    examDate,
    reminderEnabled: value.reminderEnabled === true,
    reminderTime,
    createdAt: isString(value.createdAt) ? value.createdAt : fallbackTimestamp,
    updatedAt: isString(value.updatedAt) ? value.updatedAt : fallbackTimestamp,
  };
}

function hydrateWords(value: unknown): Word[] {
  const storedById = new Map<string, Record<string, unknown>>();

  if (Array.isArray(value)) {
    for (const item of value) {
      if (isRecord(item) && isString(item.id)) {
        storedById.set(item.id, item);
      }
    }
  }

  return wordSeeds.map((seed) => {
    const stored = storedById.get(seed.id);

    return {
      ...seed,
      isSaved: stored?.isSaved === true,
      status: isWordStatus(stored?.status) ? stored.status : 'new',
      reviewCount:
        typeof stored?.reviewCount === 'number' && stored.reviewCount >= 0
          ? stored.reviewCount
          : 0,
      lastReviewedAt: isString(stored?.lastReviewedAt) ? stored.lastReviewedAt : null,
    };
  });
}

function parseQuizAnswers(value: unknown): QuizAnswer[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || !isString(item.wordId)) {
      return [];
    }

    return [{ wordId: item.wordId, isCorrect: item.isCorrect === true }];
  });
}

function parseQuizResults(value: unknown): QuizResult[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      !isString(item.id) ||
      !isString(item.date) ||
      !isValidLocalDateKey(item.date)
    ) {
      return [];
    }

    return [
      {
        id: item.id,
        date: item.date,
        completedAt: isString(item.completedAt) ? item.completedAt : new Date().toISOString(),
        totalQuestions:
          typeof item.totalQuestions === 'number' && item.totalQuestions > 0
            ? item.totalQuestions
            : 5,
        correctAnswers:
          typeof item.correctAnswers === 'number' && item.correctAnswers >= 0
            ? item.correctAnswers
            : 0,
        answers: parseQuizAnswers(item.answers),
      },
    ];
  });
}

function parseWritingScores(value: unknown): WritingScores | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isCriterionScore(value.taskResponse) ||
    !isCriterionScore(value.coherenceAndCohesion) ||
    !isCriterionScore(value.lexicalResource) ||
    !isCriterionScore(value.grammaticalRangeAndAccuracy)
  ) {
    return null;
  }

  return {
    taskResponse: value.taskResponse,
    coherenceAndCohesion: value.coherenceAndCohesion,
    lexicalResource: value.lexicalResource,
    grammaticalRangeAndAccuracy: value.grammaticalRangeAndAccuracy,
  };
}

function parseEssays(value: unknown): Essay[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || !isString(item.id) || !isString(item.promptId)) {
      return [];
    }

    const fallbackTimestamp = new Date().toISOString();
    const overallBand =
      typeof item.overallBand === 'number' && item.overallBand >= 1 && item.overallBand <= 9
        ? (item.overallBand as BandScore)
        : null;

    return [
      {
        id: item.id,
        promptId: item.promptId,
        body: typeof item.body === 'string' ? item.body : '',
        wordCount: typeof item.wordCount === 'number' ? item.wordCount : 0,
        startedAt: isString(item.startedAt) ? item.startedAt : fallbackTimestamp,
        updatedAt: isString(item.updatedAt) ? item.updatedAt : fallbackTimestamp,
        completedAt: isString(item.completedAt) ? item.completedAt : null,
        elapsedSeconds:
          typeof item.elapsedSeconds === 'number' && item.elapsedSeconds >= 0
            ? item.elapsedSeconds
            : 0,
        scores: parseWritingScores(item.scores),
        overallBand,
      },
    ];
  });
}

function parseDailyActivities(value: unknown): DailyActivity[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      !isString(item.date) ||
      !isValidLocalDateKey(item.date)
    ) {
      return [];
    }

    return [
      {
        date: item.date,
        wordOfDay: item.wordOfDay === true,
        quiz: item.quiz === true,
        writing: item.writing === true,
        updatedAt: isString(item.updatedAt) ? item.updatedAt : new Date().toISOString(),
      },
    ];
  });
}

function parseAppState(value: unknown): AppState | null {
  if (!isRecord(value) || value.schemaVersion !== APP_STATE_SCHEMA_VERSION) {
    return null;
  }

  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    profile: parseProfile(value.profile),
    words: hydrateWords(value.words),
    quizResults: parseQuizResults(value.quizResults),
    essays: parseEssays(value.essays),
    dailyActivities: parseDailyActivities(value.dailyActivities),
  };
}

export async function loadAppState(): Promise<AppState> {
  try {
    const serializedState = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);

    if (!serializedState) {
      return createInitialAppState();
    }

    const parsedState: unknown = JSON.parse(serializedState);
    return parseAppState(parsedState) ?? createInitialAppState();
  } catch {
    return createInitialAppState();
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}

export async function clearAppState(): Promise<void> {
  await AsyncStorage.multiRemove([APP_STATE_STORAGE_KEY, LEGACY_APP_STATE_STORAGE_KEY]);
}
