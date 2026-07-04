// The base visual shell (border, radius, padding, background) reused
// by every dashboard widget — WelcomeCard, ATSScoreCard, charts, etc.
// Without this, each widget would redeclare the same four Tailwind
// classes, and a design tweak (e.g. radius change) would mean editing
// a dozen files instead of one.

function Card({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component
      className={`rounded-2xl border border-line bg-surface p-6 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
