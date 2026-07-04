// Features grid. Uses the scroll-reveal hook so cards fade up as the
// user scrolls to them — a restrained version of motion, not a
// per-card carousel of effects.

import { ScanSearch, Target, FileText, Sparkles, ShieldCheck, GitCompareArrows } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "ATS-readability scan",
    description:
      "Checks parsing, formatting, and structure the way real applicant tracking systems do — before a human ever opens it.",
  },
  {
    icon: Target,
    title: "Job-description matching",
    description:
      "Paste a job post and get a precise match score, with the exact keywords and skills you're missing.",
  },
  {
    icon: GitCompareArrows,
    title: "Retrieval-grounded feedback",
    description:
      "Suggestions are grounded in the actual text of your resume via RAG — not generic advice copy-pasted for everyone.",
  },
  {
    icon: FileText,
    title: "Section-by-section breakdown",
    description:
      "Summary, experience, skills, and education are each scored individually, so you know exactly where to focus.",
  },
  {
    icon: Sparkles,
    title: "Rewrite suggestions",
    description:
      "Get concrete, rewritten bullet points — not just 'add more action verbs' — grounded in your real experience.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Your resume is processed for analysis only. You control what's stored, and can delete your data anytime.",
  },
];

function FeatureCard({ icon: Icon, title, description, index }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition-opacity ${
        isVisible ? "animate-reveal-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-raised">
        <Icon className="h-5 w-5 text-cyan" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Features"
          title="Everything a recruiter checks. Automated."
          subtitle="Resumly combines ATS-style parsing with AI judgment, so feedback is both technically accurate and genuinely useful."
        />
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
