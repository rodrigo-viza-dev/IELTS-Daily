import AsyncStorage from '@react-native-async-storage/async-storage';

import { wordSeeds } from '@/data/seed';
import type { AppState } from '@/types/models';

import { APP_STATE_STORAGE_KEY } from './keys';

export function createInitialAppState(): AppState {
  return {
    schemaVersion: 1,
    profile: null,
    words: wordSeeds.map((word) => ({
      ...word,
      status: 'new' as const,
      isSaved: false,
      reviewCount: 0,
      lastReviewedAt: null,
    })),
    quizResults: [],
    writingEntries: [],
    dailyLogs: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAppState(value: unknown): value is AppState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === 1 &&
    (value.profile === null || isRecord(value.profile)) &&
    Array.isArray(value.words) &&
    Array.isArray(value.quizResults) &&
    Array.isArray(value.writingEntries) &&
    Array.isArray(value.dailyLogs)
  );
}

export async function loadAppState(): Promise<AppState> {
  try {
    const serializedState = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);

    if (!serializedState) {
      return createInitialAppState();
    }

    const parsedState: unknown = JSON.parse(serializedState);
    return isAppState(parsedState) ? parsedState : createInitialAppState();
  } catch {
    return createInitialAppState();
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
}

export async function clearAppState(): Promise<void> {
  await AsyncStorage.removeItem(APP_STATE_STORAGE_KEY);
}
