// Testimonials use entirely fictional personas (initials-based avatars,
// invented names/roles) — never real, named public figures or photos.
// Swap TESTIMONIALS with real customer quotes once you have them.

import SectionHeading from "../ui/SectionHeading";

const TESTIMONIALS = [
  {
    initials: "JM",
    name: "Jordan M.",
    role: "Frontend Engineer, job-hunting after a layoff",
    quote:
      "I'd sent out 60 applications with almost no callbacks. Resumly flagged that my resume wasn't parsing my skills section at all — fixed that in ten minutes and started getting responses that week.",
  },
  {
    initials: "AK",
    name: "Aisha K.",
    role: "Recent CS graduate",
    quote:
      "The job-description matching feature is the whole reason I use this. It's the difference between guessing and knowing exactly which keywords a specific posting cares about.",
  },
  {
    initials: "DR",
    name: "Diego R.",
    role: "Product manager, career switcher",
    quote:
      "Most resume tools give you the same five tips regardless of what you upload. This one actually referenced specific bullet points from my resume — felt like real feedback.",
  },
];

function TestimonialCard({ initials, name, role, quote }) {
  return (
    <figure className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6">
      <blockquote className="text-sm leading-relaxed text-ink">“{quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-raised font-mono text-xs text-cyan">
          {initials}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink">{name}</span>
          <span className="text-xs text-ink-muted">{role}</span>
        </div>
      </figcaption>
    </figure>
  );
}

function TestimonialsSection() {
  return (
    <section className="border-y border-line bg-surface/40 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Testimonials"
          title="Job seekers use Resumly before every application"
        />
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
