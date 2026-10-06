import rawGuideQuestions from './writing-guide-questions.json';
import rawWritingPrompts from './writing-prompts.json';
import rawWords from './words.json';

import type { GuideQuestion, WordSeed, WritingPrompt } from '@/types/models';

export const wordSeeds = rawWords as WordSeed[];
export const writingPrompts = rawWritingPrompts as WritingPrompt[];
export const guideQuestions = rawGuideQuestions as GuideQuestion[];
