// Pricing section — DUMMY DATA per the brief. Replace PRICING_TIERS
// with real prices/limits once the billing feature is actually built
// (a later phase, likely alongside Stripe or a similar provider).

import { Check } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try the core scan on a single resume.",
    features: ["1 resume scan / month", "ATS readability check", "Basic score breakdown"],
    cta: "Get started",
    variant: "secondary",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    description: "For active job seekers applying weekly.",
    features: [
      "Unlimited resume scans",
      "Job-description matching",
      "Full RAG-grounded report",
      "Rewrite suggestions",
    ],
    cta: "Start free trial",
    variant: "primary",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "For career coaches and bootcamps.",
    features: ["Everything in Pro", "Up to 10 seats", "Shared resume library", "Priority support"],
    cta: "Contact sales",
    variant: "secondary",
  },
];

function PricingCard({ tier }) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-2xl border p-8 ${
        tier.highlighted ? "border-cyan/40 bg-surface shadow-[0_0_40px_-10px_theme(colors.cyan/40%)]" : "border-line bg-surface"
      }`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold text-ink">{tier.name}</h3>
        <p className="text-sm text-ink-muted">{tier.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold text-ink">{tier.price}</span>
        <span className="text-sm text-ink-muted">{tier.period}</span>
      </div>

      <Button variant={tier.variant} size="md" className="w-full">
        {tier.cta}
      </Button>

      <ul className="flex flex-col gap-3 border-t border-line pt-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing, cancel anytime"
          subtitle="Placeholder tiers for now — wire up real billing once payments are in scope."
        />
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
