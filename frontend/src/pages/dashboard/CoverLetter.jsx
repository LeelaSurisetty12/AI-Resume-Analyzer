import { useState, useEffect } from "react";
import { FileEdit, Loader2, FileText, Check, Copy, FileSignature } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

function CoverLetter() {
  const { user } = useAuth();
  const [resumeId, setResumeId] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [letterContent, setLetterContent] = useState("");

  // Fetch the user's latest resume ID
  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resume/latest?user_id=${user?.uid || "anonymous"}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setResumeId(data.id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch latest resume", e);
      }
    };
    fetchLatestResume();
  }, [user]);

  // Once we have a resume ID, check if there's an existing cover letter session
  useEffect(() => {
    if (!resumeId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cover-letter/latest/${resumeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.has_letter) {
            setLetterContent(data.content);
            if (data.company_name) setCompanyName(data.company_name);
            if (data.job_description) setJobDescription(data.job_description);
          }
        }
      } catch (e) {
        console.error("Failed to fetch cover letter", e);
      }
    };
    fetchSession();
  }, [resumeId]);

  const handleGenerate = async () => {
    if (!resumeId) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cover-letter/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_id: resumeId,
          company_name: companyName || null,
          job_description: jobDescription || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLetterContent(data.content);
      } else {
        alert("Failed to generate cover letter. Please try again.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!resumeId) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <FileEdit className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cover Letter</h1>
            <p className="text-gray-400">Generate a tailored cover letter draft from your resume.</p>
          </div>
        </div>
        <Card className="flex flex-col items-center justify-center flex-1 p-8 text-center border-dashed">
          <FileText className="w-12 h-12 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Resume Found</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            You need to upload and analyze a resume before you can generate a cover letter. Head over to the Upload section to get started.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <FileEdit className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Cover Letter</h1>
          <p className="text-gray-400">Instantly generate a tailored cover letter for your job application.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Form */}
        <Card className="flex flex-col gap-6 p-6 lg:col-span-1 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Target Role Details</h2>
            <p className="text-gray-400 text-sm mb-4">Provide the job details and we'll handle the rest.</p>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Job Description</label>
                <textarea
                  className="w-full h-48 px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-auto" 
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileSignature className="w-5 h-5" />
                {letterContent ? "Regenerate Letter" : "Generate Letter"}
              </>
            )}
          </Button>
        </Card>

        {/* Right Column: Result */}
        <Card className="flex flex-col lg:col-span-2 overflow-hidden border-dashed bg-gray-900/50">
          {!letterContent && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FileSignature className="w-12 h-12 text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">No Letter Generated</h2>
              <p className="text-gray-500 max-w-sm">
                Fill out the details on the left and click generate to create your custom cover letter.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-400">Crafting your professional story...</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gray-900">
                <span className="text-sm font-medium text-gray-300">Generated Cover Letter</span>
                <Button 
                  variant="outline" 
                  className={`text-sm px-4 py-1.5 h-8 gap-2 ${isCopied ? 'border-emerald-500 text-emerald-400 hover:text-emerald-300' : ''}`}
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Text
                    </>
                  )}
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="prose prose-invert max-w-none font-serif text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {letterContent}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default CoverLetter;
