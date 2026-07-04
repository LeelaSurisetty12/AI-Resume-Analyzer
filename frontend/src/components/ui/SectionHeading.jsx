// Standardizes the "eyebrow + headline + subcopy" pattern that every
// section on the landing page uses. Without this, each section would
// duplicate the same heading markup with slightly different spacing.

import Badge from "./Badge";

function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="text-base text-ink-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export default SectionHeading;
