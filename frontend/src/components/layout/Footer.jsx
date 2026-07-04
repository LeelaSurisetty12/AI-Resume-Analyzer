// Site footer. Link data is defined as a plain object so adding a new
// column later is a data change, not a markup change.

import { ScanLine, Globe, Mail, MessageCircle } from "lucide-react";

const FOOTER_LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers"],
  Resources: ["Resume guides", "ATS glossary", "Help center"],
  Legal: ["Privacy policy", "Terms of service"],
};

function Footer() {
  return (
    <footer className="border-t border-line bg-base">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <ScanLine className="h-5 w-5 text-cyan" strokeWidth={2.25} />
              Resumly
            </a>
            <p className="text-sm text-ink-muted">
              A data-backed read on your resume, before a recruiter ever sees it.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Website" className="text-ink-muted hover:text-ink">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Email" className="text-ink-muted hover:text-ink">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Community" className="text-ink-muted hover:text-ink">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([column, links]) => (
            <div key={column} className="flex flex-col gap-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink-muted">{column}</h4>
              {links.map((link) => (
                <a key={link} href="#" className="text-sm text-ink-muted hover:text-ink">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Resumly. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ink-muted">Built with FastAPI + Gemini + RAG</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
