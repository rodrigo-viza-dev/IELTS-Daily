export type TargetBand = 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9;

export type BandScore =
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 4.5
  | 5
  | 5.5
  | 6
  | 6.5
  | 7
  | 7.5
  | 8
  | 8.5
  | 9;

export type CriterionScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type WordStatus = 'new' | 'review' | 'mastered';

export type WordPartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'conjunction';

export type WritingCriterion =
  | 'taskResponse'
  | 'coherenceAndCohesion'
  | 'lexicalResource'
  | 'grammaticalRangeAndAccuracy';

export type LocalDate = string;
export type IsoDateTime = string;

export interface UserProfile {
  id: string;
  targetBand: TargetBand;
  examDate: LocalDate | null;
  reminderEnabled: boolean;
  reminderTime: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WordSeed {
  id: string;
  term: string;
  meaningEs: string;
  partOfSpeech: WordPartOfSpeech;
  exampleEn: string;
}

export interface Word extends WordSeed {
  status: WordStatus;
  isSaved: boolean;
  reviewCount: number;
  lastReviewedAt: IsoDateTime | null;
}

export interface QuizAnswer {
  wordId: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  completedAt: IsoDateTime;
  totalQuestions: 5;
  correctAnswers: number;
  answers: QuizAnswer[];
}

export interface WritingPrompt {
  id: string;
  title: string;
  question: string;
}

export interface WritingScores {
  taskResponse: CriterionScore;
  coherenceAndCohesion: CriterionScore;
  lexicalResource: CriterionScore;
  grammaticalRangeAndAccuracy: CriterionScore;
}

export interface WritingEntry {
  id: string;
  promptId: string;
  body: string;
  wordCount: number;
  startedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
  elapsedSeconds: number;
  scores: WritingScores | null;
  overallBand: BandScore | null;
  updatedAt: IsoDateTime;
}

export interface GuideQuestion {
  id: WritingCriterion;
  order: 1 | 2 | 3 | 4;
  criterionLabelEn: string;
  questionEs: string;
}

export interface DailyLog {
  date: LocalDate;
  tasks: {
    wordOfDay: boolean;
    quiz: boolean;
    writing: boolean;
  };
  updatedAt: IsoDateTime;
}

export interface AppState {
  schemaVersion: 1;
  profile: UserProfile | null;
  words: Word[];
  quizResults: QuizResult[];
  writingEntries: WritingEntry[];
  dailyLogs: DailyLog[];
}
