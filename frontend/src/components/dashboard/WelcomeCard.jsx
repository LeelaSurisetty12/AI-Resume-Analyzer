// Greeting card at the top of the dashboard home. Pulls the user's
// email from AuthContext — swap in a display name once Profile/user
// documents (Postgres) exist in a later phase.

import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function WelcomeCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <Card className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1 font-mono text-xs text-ink-muted">
          <Sparkles className="h-3 w-3 text-cyan" />
          {getGreeting()}
        </span>
        <h2 className="font-display text-2xl font-semibold text-ink">Welcome back, {name}</h2>
        <p className="max-w-md text-sm text-ink-muted">
          Upload a resume or pick up where you left off — your last scan was 3 days ago.
        </p>
      </div>
      <Button variant="primary" size="md" onClick={() => navigate('/dashboard/upload')}>
        Analyze a resume
      </Button>
    </Card>
  );
}

export default WelcomeCard;
