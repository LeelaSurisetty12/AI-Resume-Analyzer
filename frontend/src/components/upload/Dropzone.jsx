// Generic file drop zone — drag-and-drop and "browse files" are the
// SAME code path (both end up calling onFileSelected with a File),
// so there's no risk of the two entry points validating differently.
//
// Kept generic (accept/label/hint are props) so it isn't hardcoded to
// resumes specifically, even though that's its only use today.

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

function Dropzone({ accept, label = "Drag and drop your file here", hint, onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const selected = fileList?.[0];
      if (selected) onFileSelected(selected);
    },
    [onFileSelected]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const openFileBrowser = () => inputRef.current?.click();

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={openFileBrowser}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFileBrowser();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Upload a file by dragging it here or browsing"
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragActive ? "border-cyan bg-cyan/5" : "border-line bg-surface hover:border-ink-muted"
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
        <UploadCloud className="h-6 w-6 text-cyan" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      </div>
      <span className="text-xs text-cyan underline underline-offset-2">or browse files</span>

      {/* Hidden native input handles the "browse" affordance; accept is a
          UX hint only (browsers show the wrong file if the user overrides
          the filter, and drag-drop ignores it entirely) — real validation
          always happens in JS via onFileSelected. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}

export default Dropzone;
