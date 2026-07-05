"""
Splits resume text into named sections (Education, Experience, ...) by
detecting header lines.

Why keyword matching instead of a trained classifier: resumes use a
small, predictable vocabulary for section headers ("Experience",
"Work History", "Education"...). A keyword-driven splitter is
transparent, needs no training data, and is trivial to extend by
adding a phrase to SECTION_KEYWORDS.

What this deliberately does NOT do: turn a line like "Software
Engineer, Acme Corp, 2021–2023" into separate title/company/date
fields. That level of field-by-field structuring has too many
inconsistent real-world formats for regex to handle reliably — it's a
job for the LLM in the upcoming AI/RAG phase, which can read a block
of text and reason about it the way a human would. This module's job
is strictly the layer regex over is good at: finding where each
section begins and ends.
"""

import re

# Canonical section name -> exact header phrases (lowercase) that
# indicate it. Extend this list as real-world resumes reveal new phrasing.
SECTION_KEYWORDS: dict[str, list[str]] = {
    "education": ["education", "academic background", "academic qualifications"],
    "experience": [
        "experience",
        "work experience",
        "employment history",
        "professional experience",
        "work history",
    ],
    "projects": ["projects", "personal projects", "academic projects", "key projects"],
    "skills": ["skills", "technical skills", "core competencies", "skills & tools"],
    "research": ["research", "research experience", "publications", "research & publications"],
}

# A header line is short, alphabetic (plus spaces), and optionally
# ends with a colon — this rules out normal sentence content while
# staying tolerant of "Education:" vs "Education".
_HEADER_LINE_PATTERN = re.compile(r"^[A-Za-z &]{3,40}:?$")


def _match_section(line: str) -> str | None:
    """Returns the canonical section name if `line` is a header for it, else None."""
    stripped_line = line.strip()
    if not _HEADER_LINE_PATTERN.match(stripped_line):
        return None

    normalized = stripped_line.rstrip(":").strip().lower()
    for canonical_name, keyword_variants in SECTION_KEYWORDS.items():
        if normalized in keyword_variants:
            return canonical_name

    return None


def split_into_sections(text: str) -> dict[str, list[str]]:
    """
    Returns {canonical_section_name: [content_line, ...]} for every
    section header found. A section absent from the resume is simply
    absent from the returned dict — the caller decides how to
    represent "not found" (see parser.py's `warnings` handling).

    Known limitation: assumes each section header sits alone on its
    own line, which holds for the vast majority of single-column
    resume templates but can miss headers in two-column/table layouts.
    """
    sections: dict[str, list[str]] = {}
    current_section: str | None = None

    for raw_line in text.splitlines():
        line = raw_line.strip()
        matched_section = _match_section(line)

        if matched_section:
            current_section = matched_section
            sections.setdefault(current_section, [])
            continue

        if current_section and line:
            sections[current_section].append(line)

    return sections
