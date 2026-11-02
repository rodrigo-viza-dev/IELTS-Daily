import type { DailyActivity } from '@/types/models';
import { addDaysToKey } from '@/utils/date';

export function hasAnyActivity(activity: DailyActivity | undefined): boolean {
  return activity ? activity.wordOfDay || activity.quiz || activity.writing : false;
}

export type StreakSummary = {
  current: number;
  longest: number;
};

export function calculateStreaks(
  activities: DailyActivity[],
  today: string,
): StreakSummary {
  const activeDates = Array.from(
    new Set(
      activities
        .filter((activity) => hasAnyActivity(activity))
        .map((activity) => activity.date),
    ),
  ).sort();

  if (activeDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const activeSet = new Set(activeDates);
  let cursor = activeSet.has(today) ? today : addDaysToKey(today, -1);
  let current = 0;

  while (activeSet.has(cursor)) {
    current += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  let longest = 1;
  let run = 1;

  for (let index = 1; index < activeDates.length; index += 1) {
    if (addDaysToKey(activeDates[index - 1], 1) === activeDates[index]) {
      run += 1;
    } else {
      run = 1;
    }

    if (run > longest) {
      longest = run;
    }
  }

  return { current, longest };
}
