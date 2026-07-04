// Owns the entire resume-upload lifecycle: validation, upload progress,
// and result state. Why a hook instead of inline useState in the page
// component: UploadResume.jsx should only describe WHAT the UI looks
// like for each status, not re-implement validation/progress logic —
// and this hook is reusable if resume upload is ever needed elsewhere
// (e.g. a "replace resume" flow on the Profile page).

import { useCallback, useState } from "react";
import { validateResumeFile } from "../utils/fileValidation";
import { uploadResume } from "../services/resumeService";

/**
 * @returns {{
 *   file: File | null,
 *   status: 'idle' | 'uploading' | 'success' | 'error',
 *   progress: number,
 *   error: string | null,
 *   uploadedResume: object | null,
 *   selectFile: (file: File) => void,
 *   upload: () => Promise<void>,
 *   reset: () => void,
 * }}
 */
export function useResumeUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);

  const selectFile = useCallback((selectedFile) => {
    const { valid, error: validationError } = validateResumeFile(selectedFile);

    setStatus("idle");
    setProgress(0);
    setUploadedResume(null);

    if (!valid) {
      setFile(null);
      setError(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);
  }, []);

  const upload = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setError(null);
    setProgress(0);

    try {
      const result = await uploadResume(file, setProgress);
      setUploadedResume(result);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      // FastAPI's HTTPException detail surfaces at err.response.data.detail
      setError(err?.response?.data?.detail || "Upload failed. Please check your connection and try again.");
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setUploadedResume(null);
  }, []);

  return { file, status, progress, error, uploadedResume, selectFile, upload, reset };
}
