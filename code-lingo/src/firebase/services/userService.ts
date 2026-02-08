import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this points to your firebase config
import type { LanguageId } from "../types";
import {
  getUserProfile,
  updateAvatar,
  setLanguages,
} from "../db";

export const userService = {
  getUserProfile,
  updateAvatar,
  setLanguages,

  // We rewrite enrollLanguage here to ensure it uses arrayUnion
  async enrollLanguage(uid: string, langId: LanguageId) {
    try {
      const userRef = doc(db, 'users', uid);
      
      // updateDoc with arrayUnion adds the language ONLY if it isn't already there
      await updateDoc(userRef, {
        enrolledLanguages: arrayUnion(langId),
        currentLanguage: langId // Automatically switch to the new language
      });
      
      console.log(`User ${uid} successfully enrolled in ${langId}`);
    } catch (error) {
      console.error("Error in userService.enrollLanguage:", error);
      throw error;
    }
  },

  async switchCurrentLanguage(uid: string, currentLanguage: LanguageId) {
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error("Profile not found");
    await setLanguages(uid, profile.enrolledLanguages, currentLanguage);
  },
};