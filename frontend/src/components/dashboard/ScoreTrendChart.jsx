import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../ui/Card";
import { useAuth } from "../../features/auth/AuthContext";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-gray-900 px-3 py-2 font-mono text-xs text-gray-200">
      Score: {payload[0].value}
    </div>
  );
}

function ScoreTrendChart() {
  const [trendData, setTrendData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/trend?user_id=${user?.uid || "anonymous"}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((d, i) => ({
            scan: `Scan ${i + 1}`,
            score: d.score,
          }));
          setTrendData(formatted);
        }
      } catch (e) {
        console.error("Failed to fetch score trend", e);
      }
    };
    fetchTrend();
  }, [user]);

  if (trendData.length === 0) return null;

  const firstScore = trendData[0]?.score || 0;
  const latestScore = trendData[trendData.length - 1]?.score || 0;
  const ptsDiff = latestScore - firstScore;
  const ptsString = ptsDiff >= 0 ? `+${ptsDiff}` : `${ptsDiff}`;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-gray-400">Score trend</span>
        <span className="font-mono text-xs text-emerald-400">{ptsString} pts since Scan 1</span>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262b" vertical={false} />
            <XAxis dataKey="scan" tick={{ fill: "#98999e", fontSize: 11 }} axisLine={{ stroke: "#26262b" }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#98999e", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: "#34d399", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ScoreTrendChart;
