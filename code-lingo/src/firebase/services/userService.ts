import type { LanguageId } from "../types";
import {
  getUserProfile,
  updateAvatar,
  enrollLanguage,
  setLanguages,
} from "../db";

export const userService = {
  getUserProfile,
  updateAvatar,
  enrollLanguage,
  setLanguages,

  async switchCurrentLanguage(uid: string, currentLanguage: LanguageId) {
    // safer than overwriting enrolledLanguages everywhere
    const profile = await getUserProfile(uid);
    if (!profile) throw new Error("Profile not found");
    await setLanguages(uid, profile.enrolledLanguages, currentLanguage);
  },
};
