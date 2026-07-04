import { useState, useEffect } from "react";
import { Mic, Loader2, FileText, ChevronDown, ChevronUp, CheckCircle2, Search } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

function Interview() {
  const { user } = useAuth();
  const [resumeId, setResumeId] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // questions is array of {question, hint}
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  // Once we have a resume ID, check if there's an existing interview session
  useEffect(() => {
    if (!resumeId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/latest/${resumeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.has_session) {
            setQuestions(data.questions);
            if (data.job_description) setJobDescription(data.job_description);
          }
        }
      } catch (e) {
        console.error("Failed to fetch interview session", e);
      }
    };
    fetchSession();
  }, [resumeId]);

  const handleGenerate = async () => {
    if (!resumeId) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/interview/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jobDescription || null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        alert("Failed to generate questions. Please try again.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!resumeId) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Mic className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Prep</h1>
            <p className="text-gray-400">AI-generated interview questions tailored to your resume</p>
          </div>
        </div>
        <Card className="flex flex-col items-center justify-center flex-1 p-8 text-center border-dashed">
          <FileText className="w-12 h-12 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Resume Found</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            You need to upload and analyze a resume before you can generate interview questions. Head over to the Upload section to get started.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Mic className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Prep</h1>
          <p className="text-gray-400">Practice with questions tailored exactly to your experience.</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <Card className="max-w-2xl mx-auto w-full p-8 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready to Prep?</h2>
            <p className="text-gray-400 text-sm">
              I'll analyze your latest resume and generate 5 targeted interview questions (technical and behavioral) to test your experience.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Target Job Description (Optional)
            </label>
            <textarea
              className="w-full h-32 px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="Paste the job description here to tailor the questions to the specific role..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button 
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2" 
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Generate Interview Questions
              </>
            )}
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Your Tailored Questions</h2>
            <Button 
              variant="outline" 
              className="text-sm px-4 py-2"
              onClick={() => setQuestions([])} // Reset to generate new ones
            >
              Generate New Set
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {questions.map((q, idx) => (
              <Card 
                key={idx} 
                className="p-6 cursor-pointer hover:border-emerald-500/50 transition-colors"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm shrink-0">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-lg text-gray-200 mt-1">{q.question}</h3>
                  </div>
                  <div className="mt-1 shrink-0">
                    {expandedIndex === idx ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedIndex === idx && (
                  <div className="mt-6 pt-4 border-t border-white/10 ml-12">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-1">Suggested Answer Strategy</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{q.hint}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
