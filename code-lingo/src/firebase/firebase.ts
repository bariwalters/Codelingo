// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE40ubAPUZ0tC-7b857Lsu48xEXnxF_VI",
  authDomain: "codelingo-6b86f.firebaseapp.com",
  projectId: "codelingo-6b86f",
  storageBucket: "codelingo-6b86f.firebasestorage.app",
  messagingSenderId: "906215105223",
  appId: "1:906215105223:web:5b7d33a9dabbee3655d4e2"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
//const app = initializeApp(firebaseConfig);