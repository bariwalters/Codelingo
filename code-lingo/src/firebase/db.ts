// src/firebase/db.ts
import { db } from "./firebase";
export { db };

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  //serverTimestamp,
  increment,
  arrayUnion,
} from "firebase/firestore";
import type { UserProfile, LanguageId, LanguageProgress } from "./types";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { GeneratedQuestion, QuestionType } from "./types";


// Utilities
export function todayString(): string {
  // local date -> YYYY-MM-DD
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isYesterday(lastDate: string, today: string): boolean {
  // lastDate and today are YYYY-MM-DD
  const [y1, m1, d1] = lastDate.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);

  const a = new Date(y1, m1 - 1, d1);
  const b = new Date(y2, m2 - 1, d2);

  const diffMs = b.getTime() - a.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return diffMs >= oneDay && diffMs < 2 * oneDay;
}

// Firestore paths
export function userDoc(uid: string) {
  return doc(db, "users", uid);
}

export function progressDoc(uid: string, languageId: LanguageId) {
  return doc(db, "users", uid, "progress", languageId);
}


// Create user profile once (on sign up)
export async function createUserProfile(params: {
  uid: string;
  username: string;
  email: string;
  initialLanguage: LanguageId;
}) {
  const { uid, username, email, initialLanguage } = params;

  const defaultLanguages: LanguageId[] = [initialLanguage];
  const defaultCurrent: LanguageId = initialLanguage;

  const profile: Omit<UserProfile, "createdAt" | "updatedAt"> & {
    createdAt: any;
    updatedAt: any;
  } = {
    uid,
    username,
    email,

    enrolledLanguages: defaultLanguages,
    currentLanguage: defaultCurrent,

    xp: 0,
    streak: 0,
    lastActiveDate: "",

    avatarId: "coach_ada",
    voiceId: "",

    currentLessonByLanguage: {
      python: 0,
      java: 0,
      javascript: 0,
      cpp: 0,
      sql: 0,
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // 1) Create user doc
  await setDoc(userDoc(uid), profile, { merge: false });

  // 2) Create initial progress doc for default language
  const progress: LanguageProgress = {
    languageId: defaultCurrent,
    currentLessonIndex: 0,
    completedLessons: [],
    lessonHistory: [],
    updatedAt: serverTimestamp(),
  };

  await setDoc(progressDoc(uid, defaultCurrent), progress, { merge: false });
}


// Read profile
export async function getUserProfile(uid: string) {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// Update avatar selection
export async function updateAvatar(uid: string, avatarId: string, voiceId: string) {
  await updateDoc(userDoc(uid), {
    avatarId,
    voiceId,
    updatedAt: serverTimestamp(),
  });
}

// Enroll languages or switch current
export async function setLanguages(uid: string, enrolledLanguages: LanguageId[], currentLanguage: LanguageId) {
  await updateDoc(userDoc(uid), {
    enrolledLanguages,
    currentLanguage,
    updatedAt: serverTimestamp(),
  });
}

export async function enrollLanguage(uid: string, languageId: LanguageId) {
  // 1) Add to enrolledLanguages array
  await updateDoc(userDoc(uid), {
    enrolledLanguages: arrayUnion(languageId),
    updatedAt: serverTimestamp(),
  });

  // 2) Create progress doc if it doesn't exist
  const snap = await getDoc(progressDoc(uid, languageId));
  if (!snap.exists()) {
    const progress: LanguageProgress = {
      languageId,
      currentLessonIndex: 0,
      completedLessons: [],
      lessonHistory: [],
      updatedAt: serverTimestamp(),
    };
    await setDoc(progressDoc(uid, languageId), progress, { merge: false });
  }
}


export async function saveGeneratedQuestion(params: {
  uid: string;
  lessonAttemptId: string;
  question: Omit<GeneratedQuestion, "id" | "createdAt">;
}) {
  const { uid, lessonAttemptId, question } = params;

  const ref = collection(db, "users", uid, "lessons", lessonAttemptId, "questions");
  const docRef = await addDoc(ref, {
    ...question,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}


// Called after lesson completion
export async function applyLessonCompletion(params: {
  uid: string;
  language: LanguageId;
  xpGained: number;
  nextLessonIndex: number;
  lessonId: string;     // <-- add
  score?: number;       // optional
}) {
  const { uid, language, xpGained, nextLessonIndex, lessonId, score = 5 } = params;

  const profile = await getUserProfile(uid);
  const today = todayString();

  let newStreak = 1;
  if (profile?.lastActiveDate) {
    if (profile.lastActiveDate === today) newStreak = profile.streak;
    else if (isYesterday(profile.lastActiveDate, today)) newStreak = profile.streak + 1;
    else newStreak = 1;
  }

  // 1) Update totals on user doc
  await updateDoc(userDoc(uid), {
    xp: increment(xpGained),
    streak: newStreak,
    lastActiveDate: today,
    [`currentLessonByLanguage.${language}`]: nextLessonIndex,
    updatedAt: serverTimestamp(),
  });

  // 2) Update progress doc
  await updateDoc(progressDoc(uid, language), {
    currentLessonIndex: nextLessonIndex,
    completedLessons: arrayUnion(lessonId),
    lessonHistory: arrayUnion({
      lessonId,
      score,
      xpGained,
      completedAt: serverTimestamp(),
    }),
    updatedAt: serverTimestamp(),
  });
}
