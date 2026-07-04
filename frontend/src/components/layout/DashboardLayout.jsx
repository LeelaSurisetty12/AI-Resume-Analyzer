// Parent layout for the entire /dashboard/* route tree.
//
// Why nested routes + <Outlet> instead of wrapping every page
// individually: the sidebar and topbar are rendered ONCE, and React
// Router swaps only the <Outlet /> content when navigating between
// /dashboard, /dashboard/upload, /dashboard/history, etc. — no
// sidebar re-mount, no flash, and each page component only needs to
// export its own content.

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardTopbar from "./DashboardTopbar";

const TITLES_BY_PATH = {
  "/dashboard": "Dashboard",
  "/dashboard/upload": "Upload Resume",
  "/dashboard/analysis": "Analysis",
  "/dashboard/resume-chat": "Resume Chat",
  "/dashboard/interview": "Interview Prep",
  "/dashboard/cover-letter": "Cover Letter",
  "/dashboard/history": "History",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES_BY_PATH[location.pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar title={title} onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
