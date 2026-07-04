// Signup page.
//
// Flow: validate with zod -> create the account -> Firebase sends the
// verification email automatically (handled inside authService.signup)
// -> redirect to /verify-email, where the user is told to check inbox.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../features/auth/AuthContext";
import { signupSchema } from "../features/auth/validationSchemas";
import { getFirebaseErrorMessage } from "../features/auth/firebaseErrors";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      await signup(data.email, data.password);
      navigate("/verify-email", { replace: true });
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start scanning your resume in under a minute">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {formError && <Alert variant="error">{formError}</Alert>}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />

        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password}
          {...register("password")}
        />

        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register("confirmPassword")}
        />

        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-cyan hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
