"""
Extracts contact fields (name, email, phone) from resume text/spans.

Why these use two different strategies:
- Email and phone have constrained, predictable formats — regex is the
  right tool and will be reliable.
- A person's name has no fixed pattern, so regex isn't appropriate.
  Instead we use font-size metadata (a candidate's name is almost
  always the single largest piece of text on the page, since it's the
  document's de facto title) as the primary signal, falling back to
  "first line that looks like a name" when font data is missing or
  inconclusive (e.g. a DOCX with no explicit sizing, or a name that
  isn't actually the largest span for some unusual template).
"""

import re

from app.services.resume_parser.text_extraction import Span

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")

# Matches formats like "+1 (555) 123-4567", "555-123-4567", "5551234567",
# "+91 98765 43210" — deliberately loose, then filtered by digit count below.
PHONE_PATTERN = re.compile(r"(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)\d{3,4}[\s.-]?\d{3,4}")


def extract_email(text: str) -> str | None:
    match = EMAIL_PATTERN.search(text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    # Phone numbers appear near the top of a resume (header/contact
    # block); restricting the search avoids accidentally matching
    # numeric sequences deeper in the document (dates, zip codes).
    for line in text.splitlines()[:40]:
        match = PHONE_PATTERN.search(line)
        if not match:
            continue
        digit_count = len(re.sub(r"\D", "", match.group(0)))
        if 7 <= digit_count <= 15:  # plausible phone number length; filters out e.g. bare years
            return match.group(0).strip()
    return None


def _looks_like_name(line: str) -> bool:
    """Cheap heuristic: short, no digits, no email/phone, 1-5 words."""
    if not line or len(line) > 60:
        return False
    if EMAIL_PATTERN.search(line) or PHONE_PATTERN.search(line):
        return False
    if any(char.isdigit() for char in line):
        return False
    word_count = len(line.split())
    return 1 <= word_count <= 5


def extract_name(text: str, spans: list[Span]) -> str | None:
    """
    Primary strategy: largest-font-size span within the first page that
    passes the "looks like a name" heuristic.
    Fallback: first plain-text line (within the first 10 lines) that
    passes the same heuristic.
    """
    first_page_spans = [span for span in spans if span["page"] == 0][:30]

    name_candidates = sorted(
        (span for span in first_page_spans if _looks_like_name(span["text"])),
        key=lambda span: span["size"],
        reverse=True,
    )
    if name_candidates:
        return name_candidates[0]["text"]

    for line in text.splitlines()[:10]:
        stripped = line.strip()
        if _looks_like_name(stripped):
            return stripped

    return None
