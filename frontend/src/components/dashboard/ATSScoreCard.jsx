import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import Card from "../ui/Card";
import { useAuth } from "../../features/auth/AuthContext";

function ATSScoreCard() {
  const [latestScore, setLatestScore] = useState(null);
  const [fileName, setFileName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/recent?user_id=${user?.uid || "anonymous"}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setLatestScore(data[0].ats_score);
            setFileName(data[0].filename);
          }
        }
      } catch (e) {
        console.error("Failed to fetch recent analysis for ATS score", e);
      }
    };
    fetchRecent();
  }, [user]);

  const displayScore = latestScore !== null ? latestScore : 0;
  const chartData = [{ name: "score", value: displayScore, fill: "#34d399" }];

  return (
    <Card className="flex flex-col items-center gap-2">
      <span className="self-start text-xs uppercase tracking-wider text-gray-400">
        Latest ATS Score
      </span>

      <div className="relative flex h-40 w-40 items-center justify-center">
        <RadialBarChart
          width={160}
          height={160}
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="100%"
          barSize={10}
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#1f2937" }} />
        </RadialBarChart>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-3xl font-semibold text-gray-200">{latestScore !== null ? displayScore : "-"}</span>
          <span className="font-mono text-[10px] text-gray-500">/ 100</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        {latestScore !== null ? (
          <>Based on your most recent scan — <span className="text-emerald-400">{fileName}</span></>
        ) : (
          "No scans yet"
        )}
      </p>
    </Card>
  );
}

export default ATSScoreCard;
