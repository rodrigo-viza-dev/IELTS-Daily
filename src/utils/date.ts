import type { LocalDate } from '@/types/models';

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'set',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_LONG = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const WEEKDAYS_INITIAL = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export function toLocalDateKey(date: Date): LocalDate {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayKey(now: Date = new Date()): LocalDate {
  return toLocalDateKey(now);
}

export function parseLocalDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isValidLocalDateKey(key: string): boolean {
  return parseLocalDateKey(key) !== null;
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function signedDaysUntilDate(key: LocalDate, now: Date = new Date()): number | null {
  const date = parseLocalDateKey(key);

  if (!date) {
    return null;
  }

  const difference = startOfLocalDay(date).getTime() - startOfLocalDay(now).getTime();
  return Math.round(difference / MS_PER_DAY);
}

export function daysUntilDate(key: LocalDate, now: Date = new Date()): number {
  const days = signedDaysUntilDate(key, now);
  return days === null ? 0 : Math.max(0, days);
}

export function isFutureDateKey(key: LocalDate, now: Date = new Date()): boolean {
  const days = signedDaysUntilDate(key, now);
  return days !== null && days > 0;
}

export function addDaysToKey(key: LocalDate, amount: number): LocalDate {
  const date = parseLocalDateKey(key);

  if (!date) {
    return key;
  }

  date.setDate(date.getDate() + amount);
  return toLocalDateKey(date);
}

export function formatShortDateKey(key: LocalDate): string {
  const date = parseLocalDateKey(key);

  if (!date) {
    return key;
  }

  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatLongDate(date: Date = new Date()): string {
  const weekday = WEEKDAYS_LONG[date.getDay()];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized} ${date.getDate()} de ${MONTHS_LONG[date.getMonth()]}`;
}

export function weekdayInitial(key: LocalDate): string {
  const date = parseLocalDateKey(key);
  return date ? WEEKDAYS_INITIAL[date.getDay()] : '';
}

export function formatDayMonthShort(key: LocalDate): string {
  const date = parseLocalDateKey(key);
  return date ? `${date.getDate()}/${date.getMonth() + 1}` : '';
}

export function formatDateKeyForInput(key: LocalDate | null): string {
  const date = key ? parseLocalDateKey(key) : null;

  if (!date) {
    return '';
  }

  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function parseDateInput(value: string): LocalDate | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return toLocalDateKey(date);
}

export function formatTimeLabel(time: string): string {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return time;
  }

  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? 'p. m.' : 'a. m.';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${suffix}`;
}
