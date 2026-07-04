// Reusable banner for form-level (not field-level) feedback — e.g.
// "Incorrect email or password" or "Password reset email sent".
// Field-level errors use FormField's built-in error prop instead.

import { AlertCircle, CheckCircle2 } from "lucide-react";

const VARIANTS = {
  error: {
    icon: AlertCircle,
    classes: "border-red-500/30 bg-red-500/10 text-red-400",
  },
  success: {
    icon: CheckCircle2,
    classes: "border-cyan/30 bg-cyan/10 text-cyan",
  },
};

/**
 * @param {'error'|'success'} variant
 */
function Alert({ variant = "error", children }) {
  const { icon: Icon, classes } = VARIANTS[variant];

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${classes}`} role="alert">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
