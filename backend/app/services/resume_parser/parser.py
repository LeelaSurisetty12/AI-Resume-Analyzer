"""
Top-level resume parsing orchestrator.

This is the ONLY module the API route should import from — it wires
together text extraction, contact-field extraction, and section
splitting, and shapes the final result. Keeping this composition in
one place (rather than the route calling three separate services)
means the parsing pipeline can be changed or reordered without
touching the route at all.
"""

import re
from pathlib import Path

from app.services.resume_parser.contact_extractor import extract_email, extract_name, extract_phone
from app.services.resume_parser.section_extractor import split_into_sections
from app.services.resume_parser.text_extraction import extract_text

# Sections where an empty result is worth flagging to the caller —
# these are near-universal in real resumes, so their absence likely
# means our header detection missed a non-standard phrasing, not that
# the candidate genuinely has no experience/education/skills.
# Projects/Research are intentionally excluded: many resumes (especially
# non-academic, non-technical ones) legitimately don't have these sections.
SECTIONS_WORTH_WARNING_IF_MISSING = ["education", "experience", "skills"]


def _split_skills_line(lines: list[str]) -> list[str]:
    """
    Skills sections are typically comma/pipe/bullet-separated on one or
    a few lines (e.g. "Python, React, AWS"), unlike Experience where
    each line is its own bullet point — so this needs different
    splitting logic than the other sections.
    """
    joined_line = " ".join(lines)
    raw_items = re.split(r"[,|•·]", joined_line)
    return [item.strip() for item in raw_items if item.strip()]


def parse_resume_file(file_path: Path) -> dict:
    """
    Parses a resume file on disk into structured fields.
    Raises ValueError for unsupported extensions (caller/route decides
    how to translate that into an HTTP response).
    """
    extension = file_path.suffix.lower()
    text, spans = extract_text(file_path, extension)

    sections = split_into_sections(text)

    warnings = [
        f"Could not confidently detect a '{section_name}' section."
        for section_name in SECTIONS_WORTH_WARNING_IF_MISSING
        if not sections.get(section_name)
    ]

    return {
        "name": extract_name(text, spans),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "education": sections.get("education", []),
        "experience": sections.get("experience", []),
        "projects": sections.get("projects", []),
        "skills": _split_skills_line(sections.get("skills", [])),
        "research": sections.get("research", []),
        "raw_text_length": len(text),
        "warnings": warnings,
    }
