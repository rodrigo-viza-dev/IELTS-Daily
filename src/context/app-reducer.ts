import { createInitialAppState } from '@/storage/app-storage';
import type {
  AppState,
  DailyActivity,
  DailyTask,
  Essay,
  IsoDateTime,
  LocalDate,
  Profile,
  QuizResult,
  WordStatus,
} from '@/types/models';
import { getWordOfDay } from '@/utils/word-of-day';

export type ProfilePatch = Partial<
  Pick<Profile, 'targetBand' | 'examDate' | 'reminderEnabled' | 'reminderTime'>
>;

export type AppAction =
  | { type: 'hydrate'; state: AppState }
  | { type: 'create-profile'; profile: Profile }
  | { type: 'update-profile'; patch: ProfilePatch; updatedAt: IsoDateTime }
  | {
      type: 'toggle-word-saved';
      wordId: string;
      date: LocalDate;
      at: IsoDateTime;
    }
  | {
      type: 'set-word-status';
      wordId: string;
      status: WordStatus;
      date: LocalDate;
      at: IsoDateTime;
    }
  | { type: 'record-quiz'; result: QuizResult }
  | { type: 'save-essay'; essay: Essay; date: LocalDate }
  | { type: 'reset' };

function markActivity(
  activities: DailyActivity[],
  date: LocalDate,
  task: DailyTask,
  at: IsoDateTime,
): DailyActivity[] {
  const existing = activities.find((activity) => activity.date === date);

  if (!existing) {
    return [
      ...activities,
      {
        date,
        wordOfDay: task === 'wordOfDay',
        quiz: task === 'quiz',
        writing: task === 'writing',
        updatedAt: at,
      },
    ];
  }

  if (existing[task]) {
    return activities;
  }

  return activities.map((activity) =>
    activity.date === date ? { ...activity, [task]: true, updatedAt: at } : activity,
  );
}

function updateWordProgress(
  state: AppState,
  result: QuizResult,
): AppState['words'] {
  const answersById = new Map(result.answers.map((answer) => [answer.wordId, answer.isCorrect]));

  return state.words.map((word) => {
    const answer = answersById.get(word.id);

    if (answer === undefined) {
      return word;
    }

    const reviewCount = word.reviewCount + 1;
    const status: WordStatus = answer
      ? reviewCount >= 2
        ? 'mastered'
        : 'review'
      : 'review';

    return {
      ...word,
      status,
      reviewCount,
      lastReviewedAt: result.completedAt,
    };
  });
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'create-profile':
      return { ...state, profile: action.profile };

    case 'update-profile':
      if (!state.profile) {
        return state;
      }

      return {
        ...state,
        profile: { ...state.profile, ...action.patch, updatedAt: action.updatedAt },
      };

    case 'toggle-word-saved': {
      const target = state.words.find((word) => word.id === action.wordId);

      if (!target) {
        return state;
      }

      const willSave = !target.isSaved;
      const words = state.words.map((word) =>
        word.id === action.wordId ? { ...word, isSaved: willSave } : word,
      );
      const wordOfDay = getWordOfDay(state.words, action.date);
      const dailyActivities =
        willSave && wordOfDay?.id === action.wordId
          ? markActivity(state.dailyActivities, action.date, 'wordOfDay', action.at)
          : state.dailyActivities;

      return { ...state, words, dailyActivities };
    }

    case 'set-word-status': {
      const target = state.words.find((word) => word.id === action.wordId);

      if (!target) {
        return state;
      }

      const words = state.words.map((word) =>
        word.id === action.wordId ? { ...word, status: action.status } : word,
      );
      const wordOfDay = getWordOfDay(state.words, action.date);
      const dailyActivities =
        action.status !== 'new' && wordOfDay?.id === action.wordId
          ? markActivity(state.dailyActivities, action.date, 'wordOfDay', action.at)
          : state.dailyActivities;

      return { ...state, words, dailyActivities };
    }

    case 'record-quiz': {
      const { result } = action;

      return {
        ...state,
        words: updateWordProgress(state, result),
        quizResults: [result, ...state.quizResults],
        dailyActivities: markActivity(
          state.dailyActivities,
          result.date,
          'quiz',
          result.completedAt,
        ),
      };
    }

    case 'save-essay': {
      const exists = state.essays.some((essay) => essay.id === action.essay.id);
      const essays = exists
        ? state.essays.map((essay) =>
            essay.id === action.essay.id ? action.essay : essay,
          )
        : [action.essay, ...state.essays];

      const dailyActivities = action.essay.completedAt
        ? markActivity(state.dailyActivities, action.date, 'writing', action.essay.updatedAt)
        : state.dailyActivities;

      return { ...state, essays, dailyActivities };
    }

    case 'reset':
      return createInitialAppState();

    default:
      return state;
  }
}
