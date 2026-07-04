// Global auth state, provided once at the app root.
//
// Why a Context instead of prop-drilling or re-fetching per page:
// - `onAuthStateChanged` is Firebase's real-time listener for the
//   current user. It should be subscribed to ONCE, at the top of the
//   app — not in every component that needs to know if someone's
//   logged in.
// - `isInitializing` solves the classic "flash of logged-out content"
//   bug: on page load, Firebase takes a moment to restore the session
//   from storage. Without this flag, a ProtectedRoute would redirect
//   to /login for a split second even for an already-logged-in user.

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import * as authService from "./authService";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Subscribes once on mount; Firebase calls this immediately with
    // the restored session (or null), then again on every login/logout.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsInitializing(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Re-reads the current user's data from Firebase (e.g. after they
   * click a verification link) and pushes the fresh object into state.
   * `reload()` mutates the SDK's internal user object, but React won't
   * re-render from that mutation alone — so we clone into a new object.
   */
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  }, []);

  const value = {
    user,
    isInitializing,
    isEmailVerified: Boolean(user?.emailVerified),
    login: authService.login,
    signup: authService.signup,
    logout: authService.logout,
    resetPassword: authService.resetPassword,
    resendVerificationEmail: authService.resendVerificationEmail,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook to consume auth state/actions. Throws if used outside <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
