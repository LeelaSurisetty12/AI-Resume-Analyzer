// Verify Email page — shown to logged-in users whose email isn't
// verified yet (redirected here by ProtectedRoute when requireVerified
// is set).
//
// Two actions:
// 1. Resend the verification email (rate-limited by Firebase itself).
// 2. "I've verified my email" — re-reads the user from Firebase, since
//    clicking the email link doesn't automatically update the SDK's
//    in-memory user object in this tab.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../features/auth/AuthContext";
import { getFirebaseErrorMessage } from "../features/auth/firebaseErrors";

function VerifyEmail() {
  const { user, isEmailVerified, resendVerificationEmail, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleResend = async () => {
    setStatus(null);
    setIsResending(true);
    try {
      await resendVerificationEmail();
      setStatus({ type: "success", message: "Verification email sent — check your inbox." });
    } catch (error) {
      setStatus({ type: "error", message: getFirebaseErrorMessage(error) });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setStatus(null);
    setIsChecking(true);
    try {
      await refreshUser();
      if (isEmailVerified) {
        navigate("/dashboard", { replace: true });
      } else {
        setStatus({ type: "error", message: "Still not verified — click the link in your email first." });
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`We sent a link to ${user?.email ?? "your email"}`}>
      <div className="flex flex-col gap-4">
        {status && <Alert variant={status.type}>{status.message}</Alert>}

        <p className="text-sm text-ink-muted">
          Click the verification link in your inbox, then come back and confirm below.
        </p>

        <Button variant="primary" size="md" isLoading={isChecking} onClick={handleCheckVerified} className="w-full">
          I've verified my email
        </Button>

        <Button variant="secondary" size="md" isLoading={isResending} onClick={handleResend} className="w-full">
          Resend verification email
        </Button>

        <button
          type="button"
          onClick={() => logout()}
          className="text-center text-xs text-ink-muted hover:text-ink"
        >
          Log out
        </button>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;
