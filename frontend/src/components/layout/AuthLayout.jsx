// Shared visual shell for every auth page (Login, Signup, Forgot
// Password, Verify Email). Keeps the centered-card layout and brand
// mark in one place instead of duplicating it four times.

import { ScanLine } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <ScanLine className="h-5 w-5 text-cyan" strokeWidth={2.25} />
            Resumly
          </a>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
