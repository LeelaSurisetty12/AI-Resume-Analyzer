// Firebase app initialization.
//
// Why this file exists on its own:
// - Firebase should be initialized EXACTLY ONCE per app lifecycle.
//   Isolating initializeApp() here (instead of calling it inside a
//   component) guarantees that, no matter how many files import
//   `auth`, they all get the same singleton instance.
// - All config values come from Vite env vars (VITE_FIREBASE_*), never
//   hardcoded — this file works identically across dev/staging/prod as
//   long as the .env file is swapped.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fail fast in development if required config is missing, instead of
// letting Firebase throw a cryptic internal error on first auth call.
if (import.meta.env.DEV && !firebaseConfig.apiKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[firebase] VITE_FIREBASE_API_KEY is missing. Copy .env.example to .env and fill in your Firebase project config."
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
