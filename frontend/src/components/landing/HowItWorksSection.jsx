// "How it works" is a genuine ordered process (upload happens before
// scoring, which happens before the report) — so numbered steps encode
// real information here, unlike a features grid where order is arbitrary.

import SectionHeading from "../ui/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Upload your resume",
    description: "Drop in a PDF or DOCX. Optionally paste the job description you're targeting.",
  },
  {
    number: "02",
    title: "RAG-powered scan",
    description:
      "Your resume is chunked, embedded, and retrieved against the role's requirements — not just pattern-matched.",
  },
  {
    number: "03",
    title: "Gemini generates your report",
    description: "Get a match score, section-by-section breakdown, and concrete rewrite suggestions.",
  },
  {
    number: "04",
    title: "Fix and re-scan",
    description: "Apply the suggestions and re-run the scan until your score is where it needs to be.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y border-line bg-surface/40 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="How it works"
          title="From upload to actionable report in four steps"
          subtitle="No account required to see how it works — the full loop takes under a minute."
        />

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col gap-3">
              <span className="font-mono text-sm text-cyan">{step.number}</span>
              <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
