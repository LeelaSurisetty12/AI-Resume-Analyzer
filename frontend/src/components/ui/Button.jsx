// Reusable Button.
// Why: every CTA across the landing page (nav, hero, pricing, footer)
// must look and behave identically. Centralizing variants here means
// a brand color tweak later happens in ONE file, not a dozen buttons.

import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-cyan to-violet text-base font-semibold hover:opacity-90 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
  secondary:
    "bg-raised text-ink border border-line hover:border-ink-muted",
  ghost: "text-ink-muted hover:text-ink",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * @param {'primary'|'secondary'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} isLoading - shows a spinner and disables the button (form submits)
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as: Component = "button",
  className = "",
  isLoading = false,
  disabled = false,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-body transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </Component>
  );
}

export default Button;
