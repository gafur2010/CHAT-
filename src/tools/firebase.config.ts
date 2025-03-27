import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBrQL6nsg1cTRDfWyog9G_ro57wKKm73U",
  authDomain: "enter-your-project-name-e6c89.firebaseapp.com",

  databaseURL:
    "https://enter-your-project-name-e6c89-default-rtdb.firebaseio.com",
  projectId: "enter-your-project-name-e6c89",
  storageBucket: "enter-your-project-name-e6c89.firebasestorage.app",
  messagingSenderId: "328877715626",
  appId: "1:328877715626:web:e48a3a07a1130e29bde0d3",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
