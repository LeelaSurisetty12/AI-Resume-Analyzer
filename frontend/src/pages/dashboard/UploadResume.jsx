// Upload Resume page — the first real (non-stub) dashboard feature.
//
// All state lives in useResumeUpload; this component only decides
// which UI to render for each status (idle / uploading / success / error).

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Dropzone from "../../components/upload/Dropzone";
import UploadProgressBar from "../../components/upload/UploadProgressBar";
import ResumePreviewCard from "../../components/upload/ResumePreviewCard";
import { useResumeUpload } from "../../hooks/useResumeUpload";
import { useAuth } from "../../features/auth/AuthContext";

function UploadResume() {
  const { file, status, progress, error, uploadedResume, selectFile, upload, reset } = useResumeUpload();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/analysis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: uploadedResume.id,
          job_description: jobDescription,
          user_id: user?.uid || "anonymous"
        })
      });

      if (!response.ok) throw new Error("Failed to analyze resume.");
      
      const data = await response.json();
      navigate('/dashboard/analysis', { state: { analysisData: data } });
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="font-display text-lg font-semibold text-ink">Upload your resume</h2>
        <p className="mt-1 text-sm text-ink-muted">PDF or DOCX, up to 5MB.</p>

        <div className="mt-5 flex flex-col gap-4">
          {!file && (
            <Dropzone
              accept=".pdf,.docx"
              label="Drag and drop your resume here"
              hint="PDF or DOCX · Max 5MB"
              onFileSelected={selectFile}
            />
          )}

          {/* Validation error shown even when no file is currently selected
              (e.g. the user dropped a .png and it was rejected). */}
          {error && !file && <Alert variant="error">{error}</Alert>}

          {file && (
            <>
              <ResumePreviewCard file={file} status={status} uploadedResume={uploadedResume} onRemove={reset} />

              {status === "uploading" && <UploadProgressBar progress={progress} />}

              {status === "success" && (
                <Alert variant="success">Resume uploaded successfully — ready for analysis.</Alert>
              )}

              {status === "error" && error && <Alert variant="error">{error}</Alert>}
              {analysisError && <Alert variant="error">{analysisError}</Alert>}

              {status === "success" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="jd" className="text-sm font-medium text-ink">
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jd"
                    rows={4}
                    className="w-full rounded-md border border-line bg-surface p-3 text-sm text-ink placeholder:text-ink-muted focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    placeholder="Paste the job description here to get tailored feedback..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {status !== "success" && (
                  <Button variant="primary" size="md" isLoading={status === "uploading"} onClick={upload}>
                    Upload resume
                  </Button>
                )}
                {status === "success" && (
                  <Button variant="primary" size="md" isLoading={isAnalyzing} onClick={handleAnalyze}>
                    Analyze resume
                  </Button>
                )}
                <Button variant="secondary" size="md" onClick={reset}>
                  {status === "success" ? "Upload another" : "Cancel"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default UploadResume;
