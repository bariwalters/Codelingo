// src/firebase/auth.ts
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createUserProfile } from "./db";

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  username: string;
}) {
  const { email, password, username } = params;

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // Create Firestore profile right after successful auth
  await createUserProfile({
    uid: cred.user.uid,
    username,
    email,
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
