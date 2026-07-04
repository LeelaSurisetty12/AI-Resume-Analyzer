// Sticky site navigation. Isolated in components/layout because, unlike
// components/ui, this component is aware of the app's structure (nav
// links, brand name) rather than being a generic, context-free control.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ScanLine } from "lucide-react";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <ScanLine className="h-5 w-5 text-cyan" strokeWidth={2.25} />
          Resumly
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
            Analyze my resume
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-ink md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-line bg-base px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-ink-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <Button variant="primary" size="sm" className="mt-2 w-full" onClick={() => { setIsMenuOpen(false); navigate('/signup'); }}>
              Analyze my resume
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
