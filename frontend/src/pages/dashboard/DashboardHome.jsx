// Dashboard home (/dashboard). Composes every main-area widget in
// order: Welcome -> stats row -> ATS score + trend chart -> recent
// analyses -> quick actions. This file only arranges components; each
// widget owns its own data and markup.

import { FileCheck2, TrendingUp, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import StatCard from "../../components/ui/StatCard";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import ATSScoreCard from "../../components/dashboard/ATSScoreCard";
import ScoreTrendChart from "../../components/dashboard/ScoreTrendChart";
import RecentAnalysesList from "../../components/dashboard/RecentAnalysesList";
import QuickActions from "../../components/dashboard/QuickActions";

function DashboardHome() {
  const [stats, setStats] = useState({ total_resumes: 0, average_score: 0, total_analyses: 0 });
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats?user_id=${user?.uid || "anonymous"}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    };
    fetchStats();
  }, [user]);

  const displayStats = [
    { label: "Resumes uploaded", value: stats.total_resumes.toString(), icon: FileCheck2 },
    { label: "Average score", value: stats.average_score.toString(), icon: TrendingUp },
    { label: "Resumes analyzed", value: stats.total_analyses.toString(), icon: Send },
    { label: "Best score", value: "-", icon: Star },
  ];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeCard />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ATSScoreCard />
        </div>
        <div className="lg:col-span-2">
          <ScoreTrendChart />
        </div>
      </div>

      <RecentAnalysesList />

      <QuickActions />
    </div>
  );
}

export default DashboardHome;
