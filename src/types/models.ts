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

export type DailyTask = 'wordOfDay' | 'quiz' | 'writing';

export type LocalDate = string;
export type IsoDateTime = string;

export interface Profile {
  targetBand: TargetBand;
  examDate: LocalDate | null;
  reminderEnabled: boolean;
  reminderTime: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WordSeed {
  id: string;
  term: string;
  category: string;
  partOfSpeech: WordPartOfSpeech;
  definitionEn: string;
  meaningEs: string;
  exampleEn: string;
}

export interface Word extends WordSeed {
  isSaved: boolean;
  status: WordStatus;
  reviewCount: number;
  lastReviewedAt: IsoDateTime | null;
}

export interface QuizAnswer {
  wordId: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  date: LocalDate;
  completedAt: IsoDateTime;
  totalQuestions: number;
  correctAnswers: number;
  answers: QuizAnswer[];
}

export interface WritingPrompt {
  id: string;
  title: string;
  category: string;
  question: string;
}

export interface WritingScores {
  taskResponse: CriterionScore;
  coherenceAndCohesion: CriterionScore;
  lexicalResource: CriterionScore;
  grammaticalRangeAndAccuracy: CriterionScore;
}

export interface Essay {
  id: string;
  promptId: string;
  body: string;
  wordCount: number;
  startedAt: IsoDateTime;
  updatedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
  elapsedSeconds: number;
  scores: WritingScores | null;
  overallBand: BandScore | null;
}

export interface GuideQuestion {
  id: WritingCriterion;
  order: 1 | 2 | 3 | 4;
  criterionLabelEn: string;
  questionEs: string;
}

export interface DailyActivity {
  date: LocalDate;
  wordOfDay: boolean;
  quiz: boolean;
  writing: boolean;
  updatedAt: IsoDateTime;
}

export interface AppState {
  schemaVersion: 2;
  profile: Profile | null;
  words: Word[];
  quizResults: QuizResult[];
  essays: Essay[];
  dailyActivities: DailyActivity[];
}
