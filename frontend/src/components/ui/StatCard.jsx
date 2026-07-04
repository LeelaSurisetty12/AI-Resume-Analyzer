// Compact metric display (icon + label + value + optional trend).
// Reused wherever a single number needs to be shown prominently —
// currently the dashboard's top stats row, but generic enough for
// History or Profile pages later.

import Card from "./Card";

/**
 * @param {'up'|'down'|null} trendDirection
 */
function StatCard({ icon: Icon, label, value, trendLabel, trendDirection = null }) {
  const trendColor =
    trendDirection === "up" ? "text-cyan" : trendDirection === "down" ? "text-red-400" : "text-ink-muted";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-muted">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />}
      </div>
      <span className="font-mono text-2xl font-semibold text-ink">{value}</span>
      {trendLabel && <span className={`text-xs ${trendColor}`}>{trendLabel}</span>}
    </Card>
  );
}

export default StatCard;
