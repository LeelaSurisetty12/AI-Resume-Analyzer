// Screenshots section. Since there's no real product build yet, this
// renders a stylized dashboard mock entirely in CSS/Tailwind (browser
// chrome + fake panels) rather than a placeholder image — swap this
// for real product screenshots once the dashboard feature exists.

import SectionHeading from "../ui/SectionHeading";

function BrowserFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-raised px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 rounded-md bg-base px-3 py-1 font-mono text-xs text-ink-muted">
          app.resumly.ai/dashboard
        </span>
      </div>

      {/* fake dashboard body */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        {/* score card */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-base p-6 sm:col-span-1">
          <span className="font-mono text-4xl font-semibold text-cyan">87</span>
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">Overall score</span>
        </div>

        {/* section breakdown */}
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-base p-6 sm:col-span-2">
          {[
            { label: "Experience", value: 92 },
            { label: "Skills match", value: 78 },
            { label: "Formatting", value: 95 },
            { label: "Keywords", value: 71 },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-ink-muted">{row.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan to-violet"
                  style={{ width: `${row.value}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs text-ink-muted">{row.value}</span>
            </div>
          ))}
        </div>

        {/* suggestion list */}
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-base p-6 sm:col-span-3">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            Top suggestions
          </span>
          {[
            "Quantify impact in your most recent role (e.g. \"reduced load time by 40%\")",
            "Add \"CI/CD\" and \"Kubernetes\" — both appear in the job description but not your resume",
            "Move technical skills above the education section for this role",
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-2 text-sm text-ink-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenshotsSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Inside the report"
          title="See the reasoning, not just a score"
          subtitle="Every number is broken down into the specific evidence behind it — pulled directly from your resume."
        />
        <div className="w-full max-w-4xl">
          <BrowserFrame />
        </div>
      </div>
    </section>
  );
}

export default ScreenshotsSection;
