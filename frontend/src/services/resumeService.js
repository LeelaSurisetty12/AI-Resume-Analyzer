// Resume API calls. Like authService for auth, this is the ONLY file
// that knows the actual endpoint shape — components call
// `uploadResume(file, onProgress)` and don't know or care that it's a
// multipart POST under the hood.

import apiClient from "./apiClient";

/**
 * Uploads a resume file, reporting progress via the onProgress callback.
 * @param {File} file
 * @param {(percent: number) => void} onProgress
 * @returns {Promise<object>} the backend's ResumeUploadResponse
 */
export async function uploadResume(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!event.total) return; // total is unknown until the browser computes it
      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress?.(percent);
    },
  });

  return response.data;
}

// The backend serves uploaded files from /uploads/..., which is NOT
// under the /api/v1 prefix. VITE_API_BASE_URL includes /api/v1, so we
// strip it to get the backend's origin for building preview URLs.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/v1\/?$/, "");

/** Resolves a relative preview_url (e.g. "/uploads/abc.pdf") to a full URL. */
export function resolveResumeFileUrl(previewUrl) {
  return `${API_ORIGIN}${previewUrl}`;
}
