// Hero section — the page's thesis statement.
// Signature element: a mock resume card with an animated "scan line"
// sweeping down it, revealing match chips and a live score. This is a
// literal depiction of what the product does (an AI reading a resume
// and extracting signal from it), not a generic gradient-blob hero.

import { useNavigate } from "react-router-dom";
import { ArrowRight, FileCheck2 } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const MATCH_CHIPS = [
  { label: "React.js", delay: "0.2s" },
  { label: "Team leadership", delay: "0.5s" },
  { label: "5+ yrs experience", delay: "0.8s" },
  { label: "AWS", delay: "1.1s" },
];

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      {/* Ambient glow — the ONE place the accent gradient is used at scale */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan/20 to-violet/20 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Left: copy */}
        <div className="flex flex-col items-start gap-6 animate-reveal-up">
          <Badge>AI-powered · RAG-grounded</Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Know exactly why your resume gets rejected.
          </h1>
          <p className="max-w-lg text-lg text-ink-muted">
            Resumly reads your resume the way an ATS and a recruiter both do —
            then tells you precisely what to fix, backed by the job
            description you're applying to.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
              Analyze my resume <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              See a sample report
            </Button>
          </div>
          <p className="font-mono text-xs text-ink-muted">
            No signup required for your first scan · Takes ~20 seconds
          </p>
        </div>

        {/* Right: signature mock resume with scan animation */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            {/* fake resume header */}
            <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-cyan" />
                <span className="font-mono text-xs text-ink-muted">resume_final_v3.pdf</span>
              </div>
              <span className="rounded-full bg-cyan/10 px-2.5 py-1 font-mono text-xs text-cyan">
                94% match
              </span>
            </div>

            {/* fake resume body lines */}
            <div className="flex flex-col gap-3">
              <div className="h-3 w-3/4 rounded bg-raised" />
              <div className="h-3 w-1/2 rounded bg-raised" />
              <div className="h-3 w-full rounded bg-raised" />
              <div className="h-3 w-5/6 rounded bg-raised" />
              <div className="h-3 w-2/3 rounded bg-raised" />
            </div>

            {/* match chips revealed progressively */}
            <div className="mt-6 flex flex-wrap gap-2">
              {MATCH_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="animate-reveal-up rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs text-cyan"
                  style={{ animationDelay: chip.delay }}
                >
                  {chip.label}
                </span>
              ))}
            </div>

            {/* the scan line itself */}
            <div
              aria-hidden="true"
              className="animate-scan-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan/0 via-cyan/25 to-violet/0"
            />
          </div>

          {/* floating score badge */}
          <div className="absolute -bottom-5 -right-5 flex flex-col items-center rounded-xl border border-line bg-raised px-5 py-3 shadow-xl">
            <span className="font-mono text-2xl font-semibold text-ink">94</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              ATS score
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
