import { useLocation, Navigate } from "react-router-dom";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import Card from "../../components/ui/Card";
import ATSScoreCard from "../../components/dashboard/ATSScoreCard";

function Analysis() {
  const location = useLocation();
  const analysisData = location.state?.analysisData;

  if (!analysisData) {
    // If someone visits /dashboard/analysis directly without passing data, redirect to upload
    return <Navigate to="/dashboard/upload" replace />;
  }

  const { ats_score, matched_skills, missing_skills, improvement_suggestions } = analysisData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-2xl font-semibold text-ink">Analysis Results</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Score */}
        <div className="lg:col-span-1">
          {/* We reuse the dashboard component but pass the actual score */}
          <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
            <h3 className="mb-6 font-display text-lg font-medium text-ink">Your ATS Score</h3>
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-cyan/20">
              {/* Pseudo-progress ring */}
              <div 
                className="absolute inset-0 rounded-full border-[12px] border-cyan"
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% ${ats_score}%, 0 ${ats_score}%)` 
                }}
              />
              <div className="flex flex-col items-center">
                <span className="font-display text-4xl font-bold text-ink">{ats_score}</span>
                <span className="text-xs text-ink-muted">/ 100</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              Based on Google Gemini AI analysis.
            </p>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-medium text-ink">
              <TrendingUp className="h-5 w-5 text-cyan" />
              Actionable Feedback
            </h3>
            <ul className="flex flex-col gap-3">
              {improvement_suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 rounded-md bg-surface p-3 text-sm text-ink">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                  <span>{suggestion}</span>
                </li>
              ))}
              {improvement_suggestions.length === 0 && (
                <p className="text-sm text-ink-muted">Your resume looks great! No major suggestions.</p>
              )}
            </ul>
          </Card>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-medium text-ink">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matched_skills.map((skill, i) => (
                  <span key={i} className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                    {skill}
                  </span>
                ))}
                {matched_skills.length === 0 && (
                  <p className="text-sm text-ink-muted">No specific skills matched.</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-medium text-ink">
                <XCircle className="h-5 w-5 text-red-500" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missing_skills.map((skill, i) => (
                  <span key={i} className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                    {skill}
                  </span>
                ))}
                {missing_skills.length === 0 && (
                  <p className="text-sm text-ink-muted">No obvious missing skills!</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
