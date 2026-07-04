// Translates Firebase Auth error codes into user-facing messages.
//
// Why this exists:
// - Firebase throws errors like `auth/invalid-credential` or
//   `auth/email-already-in-use` — technically correct but not
//   something you'd show a real user.
// - Centralizing the mapping means every form (login, signup, forgot
//   password) gets consistent, friendly copy for the same error,
//   instead of each component writing its own switch statement.

const ERROR_MESSAGES = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support if this seems wrong.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password. Try again or reset it.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/weak-password": "Password is too weak — use at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/requires-recent-login": "Please log in again to complete this action.",
};

/**
 * @param {unknown} error - error thrown by a firebase/auth call
 * @returns {string} a message safe to show directly to the user
 */
export function getFirebaseErrorMessage(error) {
  const code = error?.code;
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }
  // Fallback temporarily showing raw error for debugging
  return `Something went wrong: ${error?.message || error?.code || "Unknown error"}`;
}
