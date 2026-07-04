// Route guard for authenticated (and optionally email-verified) pages.
//
// Why this is a wrapper component, not a hook used inside every page:
// - Keeps the redirect logic in ONE place. Any protected page just
//   does <ProtectedRoute><Dashboard /></ProtectedRoute> in the route
//   table — it doesn't need to know HOW auth is checked.
// - `state={{ from: location }}` on the redirect means Login can send
//   the user back to whatever page they originally tried to visit,
//   instead of always dropping them on a generic dashboard.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../../components/ui/Spinner";

/**
 * @param {boolean} requireVerified - if true, unverified users are
 *   redirected to /verify-email instead of being let through.
 */
function ProtectedRoute({ children, requireVerified = false }) {
  const { user, isInitializing, isEmailVerified } = useAuth();
  const location = useLocation();

  // While Firebase is restoring the session from storage, show a
  // neutral loading state — NOT a redirect. Redirecting here would
  // briefly kick out already-logged-in users on every page refresh.
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-ink-muted">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}

export default ProtectedRoute;
