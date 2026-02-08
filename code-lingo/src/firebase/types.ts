// src/firebase/types.ts
export type LanguageId = "python" | "java" | "javascript" | "cpp" | "sql";

export type UserProfile = {
  uid: string;
  username: string;
  email: string;

  enrolledLanguages: LanguageId[];   // ex: ["python", "javascript"]
  currentLanguage: LanguageId;       // what the pathway shows

  xp: number;
  streak: number;
  lastActiveDate: string;            // "YYYY-MM-DD"

  avatarId: string;                  // ex: "coach_ada"
  voiceId: string;                   // ElevenLabs voice id

  // progress per language
  currentLessonByLanguage: Record<LanguageId, number>; // ex: { python: 2, java: 0, ... }

  createdAt: any; // Firestore serverTimestamp
  updatedAt: any; // Firestore serverTimestamp
};


export type LessonHistoryItem = {
  lessonId: string;
  score: number;      // out of 5
  xpGained: number;
  completedAt: any;   // Firestore timestamp
};

export type LanguageProgress = {
  languageId: LanguageId;
  currentLessonIndex: number;
  completedLessons: string[];
  lessonHistory: LessonHistoryItem[];
  updatedAt: any;
};

export type QuestionType = "fill_blank" | "arrange";

export type GeneratedQuestion = {
  id: string; // Firestore doc id
  language: LanguageId;
  lessonIndex: number;
  difficulty: number;

  questionType: QuestionType; // ✅ the “key” used by frontend

  promptText: string; // what will be shown AND later read by ElevenLabs

  // Fill-in-the-blank fields
  codeSnippet?: string; // e.g. "print(___)"
  blanks?: {
    token: string;        // e.g. "___"
    choices: string[];    // options
    answer: string;       // correct choice
  }[];

  // Arrange fields
  blocks?: string[];       // draggable tokens
  correctOrder?: string[]; // correct ordering

  explanation?: string;
  createdAt?: any;
};


