// Generic "feature not built yet" placeholder. Reused by every sidebar
// destination that doesn't have real functionality yet (Upload,
// Analysis, Resume Chat, Interview, Cover Letter, History, Profile,
// Settings) — proves routing/sidebar navigation works end-to-end
// without faking real feature content ahead of its own phase.

import Card from "../ui/Card";

function ComingSoon({ icon: Icon, title, description }) {
  return (
    <Card className="flex flex-col items-center gap-4 py-20 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
          <Icon className="h-6 w-6 text-cyan" strokeWidth={1.75} />
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <p className="max-w-md text-sm text-ink-muted">{description}</p>
      </div>
      <span className="rounded-full border border-line bg-raised px-3 py-1 font-mono text-xs text-ink-muted">
        Coming in a future phase
      </span>
    </Card>
  );
}

export default ComingSoon;
