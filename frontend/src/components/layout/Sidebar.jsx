// Dashboard sidebar navigation.
//
// Why data-driven: NAV_ITEMS is a plain array, so adding/reordering a
// nav item is a data change, not a markup change. Active-state styling
// comes from NavLink's isActive render prop — no manual location
// comparisons scattered through the component.

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  BarChart3,
  MessageSquareText,
  Mic,
  FileEdit,
  History,
  UserCircle2,
  Settings,
  LogOut,
  ScanLine,
  X,
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Upload Resume", to: "/dashboard/upload", icon: UploadCloud },
  { label: "Analysis", to: "/dashboard/analysis", icon: BarChart3 },
  { label: "Resume Chat", to: "/dashboard/resume-chat", icon: MessageSquareText },
  { label: "Interview", to: "/dashboard/interview", icon: Mic },
  { label: "Cover Letter", to: "/dashboard/cover-letter", icon: FileEdit },
  { label: "History", to: "/dashboard/history", icon: History },
  { label: "Profile", to: "/dashboard/profile", icon: UserCircle2 },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

/**
 * @param {boolean} isMobileOpen - controls the slide-in overlay on small screens
 * @param {() => void} onClose - closes the mobile overlay (e.g. after a nav click)
 */
function Sidebar({ isMobileOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-line bg-surface transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <a href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <ScanLine className="h-5 w-5 text-cyan" strokeWidth={2.25} />
            Resumly
          </a>
          <button type="button" className="text-ink-muted lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-raised text-ink"
                        : "text-ink-muted hover:bg-raised/60 hover:text-ink"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-line px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-raised font-mono text-xs text-cyan">
              {user?.email?.[0]?.toUpperCase() ?? "?"}
            </span>
            <span className="truncate text-xs text-ink-muted">{user?.email}</span>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted hover:bg-raised/60 hover:text-ink"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
