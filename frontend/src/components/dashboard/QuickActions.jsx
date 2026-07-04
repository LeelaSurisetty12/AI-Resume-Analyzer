// Grid of shortcut cards to the most common next actions. Data-driven
// so adding a new quick action later (e.g. "LinkedIn Optimizer") is a
// one-line addition to QUICK_ACTIONS, not new markup.

import { UploadCloud, MessageSquareText, Mic, FileEdit } from "lucide-react";
import Card from "../ui/Card";

const QUICK_ACTIONS = [
  {
    label: "Upload Resume",
    description: "Start a new ATS + JD match scan",
    href: "/dashboard/upload",
    icon: UploadCloud,
  },
  {
    label: "Resume Chat",
    description: "Ask questions about your resume's content",
    href: "/dashboard/resume-chat",
    icon: MessageSquareText,
  },
  {
    label: "Interview Prep",
    description: "Practice questions based on your target role",
    href: "/dashboard/interview",
    icon: Mic,
  },
  {
    label: "Cover Letter",
    description: "Generate a tailored draft in seconds",
    href: "/dashboard/cover-letter",
    icon: FileEdit,
  },
];

function QuickActions() {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-wider text-ink-muted">Quick actions</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <a key={action.label} href={action.href}>
            <Card className="flex h-full flex-col gap-3 transition-colors hover:border-cyan/40">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised">
                <action.icon className="h-4 w-4 text-cyan" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{action.label}</p>
                <p className="text-xs text-ink-muted">{action.description}</p>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
