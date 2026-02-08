import { doc, updateDoc, arrayUnion, increment, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 
import type { LanguageId } from "../types";
import { getUserProfile, updateAvatar, setLanguages } from "../db";

export const userService = {
  getUserProfile,
  updateAvatar,
  setLanguages,

  // Real-time listener for profile updates
  subscribeToProfile(uid: string, callback: (data: any) => void) {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback({ uid: doc.id, ...doc.data() });
      }
    });
  },

  // Updates XP and lesson progress
  async addLessonResults(uid: string, xpEarned: number, languageId: LanguageId) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        xp: increment(xpEarned), // Matches your DB field name
        [`currentLessonByLanguage.${languageId}`]: increment(1),
        lessonsCompletedCount: increment(1),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating lesson results:", error);
      throw error;
    }
  },

  async enrollLanguage(uid: string, langId: LanguageId) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        enrolledLanguages: arrayUnion(langId),
        currentLanguage: langId,
        [`currentLessonByLanguage.${langId}`]: 0
      });
    } catch (error) {
      console.error("Error enrolling language:", error);
      throw error;
    }
  },

  async switchCurrentLanguage(uid: string, currentLanguage: LanguageId) {
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error("Profile not found");
    await setLanguages(uid, profile.enrolledLanguages, currentLanguage);
  },
};