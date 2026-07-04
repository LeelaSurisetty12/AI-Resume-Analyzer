// Login page.
//
// Flow: validate with zod -> call authService.login via useAuth ->
// on success, redirect to the page the user originally wanted (or
// /dashboard by default) -> on failure, show a friendly Alert.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../features/auth/AuthContext";
import { loginSchema } from "../features/auth/validationSchemas";
import { getFirebaseErrorMessage } from "../features/auth/firebaseErrors";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  // Where to send the user after login: back to the page they
  // originally tried to visit (set by ProtectedRoute), or /dashboard.
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      await login(data.email, data.password, data.rememberMe);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see your resume analysis history">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {formError && <Alert variant="error">{formError}</Alert>}

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <FormField
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password}
            {...register("password")}
          />
          <Link to="/forgot-password" className="self-end text-xs text-cyan hover:underline">
            Forgot password?
          </Link>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-line bg-surface accent-cyan"
          />
          Remember me on this device
        </label>

        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don't have an account?{" "}
        <Link to="/signup" className="text-cyan hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
