// Slim top bar shown above the main content area. Its only real job
// on mobile is exposing the sidebar toggle (sidebar is hidden by
// default below the lg breakpoint). On desktop it just shows the
// current section title.

import { Menu } from "lucide-react";

function DashboardTopbar({ title, onOpenSidebar }) {
  return (
    <header className="flex items-center gap-4 border-b border-line px-6 py-4 lg:px-8">
      <button
        type="button"
        className="text-ink-muted lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
    </header>
  );
}

export default DashboardTopbar;
