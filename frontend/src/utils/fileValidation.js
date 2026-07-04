// Client-side resume file validation.
//
// Why validate here too, when the backend already validates: this
// gives the user instant feedback (no round trip) for the common case
// of picking the wrong file type or a too-large file. It's NOT a
// substitute for backend validation — the backend re-checks
// everything (and adds magic-byte sniffing) since client-side checks
// can always be bypassed.

const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

// Keep in sync with the backend's MAX_UPLOAD_SIZE_MB (backend/.env / core/config.py)
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateResumeFile(file) {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const extension = `.${file.name.split(".").pop().toLowerCase()}`;
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: "Only PDF and DOCX files are supported." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_SIZE_BYTES / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true, error: null };
}

/** Formats a byte count as a human-readable string (e.g. "1.4 MB"). */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
