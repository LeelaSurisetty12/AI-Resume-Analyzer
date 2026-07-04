// Reusable labeled input with built-in error display.
// Why: every auth form (login, signup, forgot password) needs the same
// label + input + error-message pattern. Without this, that markup
// gets copy-pasted three times and drifts out of sync over time.
//
// Designed to work directly with react-hook-form's `register()`:
//   <FormField label="Email" error={errors.email} {...register("email")} />

import { forwardRef } from "react";

const FormField = forwardRef(function FormField(
  { label, error, type = "text", ...inputProps },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputProps.name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputProps.name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputProps.name}-error` : undefined}
        className={`rounded-lg border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-cyan/50 ${
          error ? "border-red-500/60" : "border-line"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${inputProps.name}-error`} className="text-xs text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
});

export default FormField;
