import type { BandScore, TargetBand, WritingScores } from '@/types/models';

export const TARGET_BANDS: TargetBand[] = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export function isTargetBand(value: unknown): value is TargetBand {
  return typeof value === 'number' && TARGET_BANDS.includes(value as TargetBand);
}

export function formatBand(value: number): string {
  return value.toFixed(1);
}

export function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function averageWritingScores(scores: WritingScores): BandScore {
  const values = [
    scores.taskResponse,
    scores.coherenceAndCohesion,
    scores.lexicalResource,
    scores.grammaticalRangeAndAccuracy,
  ];
  const average = values.reduce((total, score) => total + score, 0) / values.length;
  return roundToHalf(average) as BandScore;
}
