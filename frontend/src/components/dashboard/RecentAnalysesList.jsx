import { useState, useEffect } from "react";
import { FileText, ChevronRight } from "lucide-react";
import Card from "../ui/Card";
import { useAuth } from "../../features/auth/AuthContext";

function scoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-violet-400";
  return "text-red-400";
}

function RecentAnalysesList() {
  const [analyses, setAnalyses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/recent?user_id=${user?.uid || "anonymous"}`);
        if (response.ok) {
          const data = await response.json();
          setAnalyses(data);
        }
      } catch (e) {
        console.error("Failed to fetch recent analyses", e);
      }
    };
    fetchRecent();
  }, [user]);

  if (analyses.length === 0) return null;

  return (
    <Card className="flex flex-col gap-1">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-gray-400">Recent analyses</span>
        <a href="#" className="text-xs text-emerald-400 hover:underline">
          View all
        </a>
      </div>

      <ul className="flex flex-col divide-y divide-white/5">
        {analyses.map((analysis) => (
          <li key={analysis.id}>
            <div className="flex items-center gap-4 py-3 first:pt-1 last:pb-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                <FileText className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-200">{analysis.filename}</p>
                <p className="truncate text-xs text-gray-500">{new Date(analysis.analyzed_at).toLocaleDateString()}</p>
              </div>
              <span className={`font-mono text-sm font-semibold ${scoreColor(analysis.ats_score)}`}>
                {analysis.ats_score}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default RecentAnalysesList;
