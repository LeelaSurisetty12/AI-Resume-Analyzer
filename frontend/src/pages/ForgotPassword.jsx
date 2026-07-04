// Forgot Password page.
//
// Flow: validate email -> call Firebase's sendPasswordResetEmail ->
// show a success Alert. We show a generic success message even if the
// email doesn't exist in Firebase, to avoid leaking which emails are
// registered (a common security best practice for this flow).

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../features/auth/AuthContext";
import { forgotPasswordSchema } from "../features/auth/validationSchemas";
import { getFirebaseErrorMessage } from "../features/auth/firebaseErrors";

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [formError, setFormError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      await resetPassword(data.email);
      setIsSent(true);
    } catch (error) {
      // Note: we still show a generic message for auth/user-not-found
      // to avoid confirming/denying whether an email is registered.
      if (error?.code === "auth/user-not-found") {
        setIsSent(true);
        return;
      }
      setFormError(getFirebaseErrorMessage(error));
    }
  };

  if (isSent) {
    return (
      <AuthLayout title="Check your email">
        <Alert variant="success">
          If an account exists for that email, a password reset link is on its way.
        </Alert>
        <Link to="/login" className="mt-6 block text-center text-sm text-cyan hover:underline">
          Back to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to reset it">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {formError && <Alert variant="error">{formError}</Alert>}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />

        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Remembered it?{" "}
        <Link to="/login" className="text-cyan hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPassword;
