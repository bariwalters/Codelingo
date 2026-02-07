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
