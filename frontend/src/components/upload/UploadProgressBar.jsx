// Reusable progress bar for any upload/long-running action — driven
// entirely by a `progress` prop (0-100) so it stays a dumb display
// component with no knowledge of Axios or upload internals.

function UploadProgressBar({ progress }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-raised"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-violet transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-mono text-xs text-ink-muted">{progress}% uploaded</span>
    </div>
  );
}

export default UploadProgressBar;
