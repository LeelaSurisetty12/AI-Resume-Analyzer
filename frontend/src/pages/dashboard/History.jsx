import { useState, useEffect } from "react";
import { History as HistoryIcon, FileText, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import { useAuth } from "../../features/auth/AuthContext";

function scoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-violet-400";
  return "text-red-400";
}

function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/history?user_id=${user?.uid || "anonymous"}`);
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleRowClick = (analysis) => {
    navigate("/dashboard/analysis", {
      state: { analysisData: analysis }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-gray-400">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <HistoryIcon className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">History</h1>
          <p className="text-gray-400">A complete log of every resume you've analyzed.</p>
        </div>
      </div>

      <Card className="flex flex-col gap-1 p-0 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No analysis history found.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-white/5">
            {history.map((analysis) => (
              <li key={analysis.id}>
                <button
                  onClick={() => handleRowClick(analysis)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                    <FileText className="h-5 w-5 text-gray-400" strokeWidth={1.75} />
                  </span>
                  
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">{analysis.filename}</p>
                    <p className="truncate text-xs text-gray-500">
                      {new Date(analysis.analyzed_at).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">ATS Score</span>
                    <span className={`font-mono text-lg font-semibold ${scoreColor(analysis.ats_score)}`}>
                      {analysis.ats_score}
                    </span>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-600 ml-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default History;
