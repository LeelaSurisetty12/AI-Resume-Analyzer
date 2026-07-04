// Auth service — the ONLY file that talks to the firebase/auth SDK
// directly for actual auth operations (AuthContext talks to Firebase
// too, but only for the onAuthStateChanged listener).
//
// Why this layer exists:
// - Components and forms call `authService.login(...)`, never
//   `signInWithEmailAndPassword` directly. If we ever swap providers
//   (e.g. add a backend session layer alongside Firebase), only this
//   file changes — not every form component.
// - Keeps Firebase-specific imports out of UI components entirely.

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Logs a user in with email/password.
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe - true = persist across browser restarts,
 *   false = session-only (cleared when the browser tab/window closes).
 */
export async function login(email, password, rememberMe) {
  // Persistence must be set BEFORE signing in — it affects how the
  // resulting session is stored, not just future logins.
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Creates a new account and immediately sends a verification email.
 * @param {string} email
 * @param {string} password
 */
export async function signup(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(credential.user);
  return credential.user;
}

/** Signs the current user out. */
export async function logout() {
  await signOut(auth);
}

/** Sends a password reset email. */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/** Resends the verification email to the currently signed-in user. */
export async function resendVerificationEmail() {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in.");
  }
  await sendEmailVerification(auth.currentUser);
}
