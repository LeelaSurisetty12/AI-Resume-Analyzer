// Reusable loading spinner. Used inside buttons during submission and
// as a full-page loader while auth state is initializing.

function Spinner({ size = "sm" }) {
  const dimensions = size === "lg" ? "h-8 w-8 border-[3px]" : "h-4 w-4 border-2";

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${dimensions}`}
    />
  );
}

export default Spinner;
