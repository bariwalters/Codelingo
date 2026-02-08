// src/firebase/auth.ts
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createUserProfile } from "./db";
import type { LanguageId } from "./types";

export { auth };

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  username: string;
  initialLanguage: LanguageId;
}) {
  const { email, password, username, initialLanguage } = params;

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await createUserProfile({
    uid: cred.user.uid,
    username,
    email,
    initialLanguage,
  });

  return cred.user;
}


export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}
