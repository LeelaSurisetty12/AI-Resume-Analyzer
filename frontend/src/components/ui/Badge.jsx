// Small pill label used above section headings ("eyebrows") to give
// each section a short, scannable category before the big headline.
// Kept as its own component so the exact same visual treatment is
// reused everywhere instead of being re-styled inline per section.

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-mono uppercase tracking-wider text-ink-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
      {children}
    </span>
  );
}

export default Badge;
