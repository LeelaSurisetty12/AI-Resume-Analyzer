// Preview card shown once a file is selected.
//
// Two different preview sources, same UI:
// - BEFORE upload completes: a local object URL (URL.createObjectURL)
//   lets the browser render the PDF instantly, with no network call.
// - AFTER upload succeeds: swaps to the backend's preview_url, proving
//   the stored file is actually retrievable (not just "trust me, it
//   uploaded").
// DOCX has no native browser renderer, so it always shows a fallback
// message rather than a broken embed.

import { useEffect, useState } from "react";
import { FileText, X, CheckCircle2 } from "lucide-react";
import { formatFileSize } from "../../utils/fileValidation";
import { resolveResumeFileUrl } from "../../services/resumeService";

function ResumePreviewCard({ file, status, uploadedResume, onRemove }) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
  const isPdf = file?.type === "application/pdf";

  useEffect(() => {
    if (!file || !isPdf) {
      setLocalPreviewUrl(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
    // Revoke on cleanup to avoid leaking memory as files are swapped.
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isPdf]);

  if (!file) return null;

  const previewSrc =
    status === "success" && uploadedResume ? resolveResumeFileUrl(uploadedResume.preview_url) : localPreviewUrl;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-raised">
          <FileText className="h-5 w-5 text-cyan" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">{file.name}</p>
          <p className="text-xs text-ink-muted">{formatFileSize(file.size)}</p>
        </div>
        {status === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan" aria-label="Uploaded" />}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove file"
          className="text-ink-muted transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isPdf && previewSrc ? (
        <iframe
          title={`Preview of ${file.name}`}
          src={previewSrc}
          className="h-80 w-full rounded-lg border border-line bg-base"
        />
      ) : (
        <div className="flex h-24 items-center justify-center rounded-lg border border-line bg-base px-4 text-center text-xs text-ink-muted">
          Preview isn't available for DOCX files in the browser — the file will still upload and analyze normally.
        </div>
      )}
    </div>
  );
}

export default ResumePreviewCard;
