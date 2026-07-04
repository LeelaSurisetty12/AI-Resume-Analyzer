// Validation schemas shared by Login, Signup, and Forgot Password forms.
//
// Why zod + react-hook-form instead of hand-rolled validation:
// - Validation rules live in ONE typed, declarative place instead of
//   scattered if-statements inside each form's submit handler.
// - react-hook-form only re-renders the field that changes (uncontrolled
//   inputs under the hood), which matters for form-heavy pages.

import { z } from "zod";

const emailSchema = z.string().min(1, "Email is required").email("Enter a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
