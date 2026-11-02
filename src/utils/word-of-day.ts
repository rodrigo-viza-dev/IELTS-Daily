import type { LocalDate, Word } from '@/types/models';
import { todayKey } from '@/utils/date';

export function getWordOfDay(words: Word[], date: LocalDate = todayKey()): Word | null {
  if (words.length === 0) {
    return null;
  }

  const seed = Number(date.replace(/-/g, ''));
  const index = Number.isFinite(seed) ? seed % words.length : 0;
  return words[index] ?? null;
}
