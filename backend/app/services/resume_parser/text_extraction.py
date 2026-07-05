"""
Raw text extraction from resume files.

Two formats are supported, matching what the Upload phase accepts:

- PDF, via PyMuPDF (`fitz`). Chosen specifically (over e.g. pdfplumber
  or PyPDF2) because it also exposes font-size metadata per text span
  — used later to guess the candidate's name, which is almost always
  the largest text on the page.
- DOCX, via `python-docx`. Word documents don't carry font-size
  metadata as reliably (many resumes rely on the template's default
  style rather than explicit run-level sizing), so DOCX name detection
  falls back to a plain-text heuristic — see contact_extractor.py.

Both extractors return the same shape: (full_text, spans). Keeping the
return type identical means the rest of the pipeline (section
splitting, contact extraction) never needs to know which format the
original file was.
"""

from pathlib import Path

import fitz  # PyMuPDF
from docx import Document

# A "span" is one contiguous run of same-styled text: {"text", "size", "page"}
Span = dict


def extract_text_from_pdf(file_path: Path) -> tuple[str, list[Span]]:
    document = fitz.open(file_path)
    full_text_parts: list[str] = []
    spans: list[Span] = []

    try:
        for page_number, page in enumerate(document):
            full_text_parts.append(page.get_text("text"))

            # "dict" mode exposes per-span font size, unlike plain "text" mode.
            structured = page.get_text("dict")
            for block in structured.get("blocks", []):
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text = span.get("text", "").strip()
                        if text:
                            spans.append({"text": text, "size": span.get("size", 0.0), "page": page_number})
    finally:
        document.close()

    return "\n".join(full_text_parts), spans


def extract_text_from_docx(file_path: Path) -> tuple[str, list[Span]]:
    document = Document(file_path)
    full_text_parts: list[str] = []
    spans: list[Span] = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue

        full_text_parts.append(text)

        # Use the first run's explicit font size if the template set one;
        # otherwise fall back to a neutral default so sorting-by-size
        # still works (just less discriminating) for DOCX name detection.
        size = 12.0
        if paragraph.runs and paragraph.runs[0].font.size:
            size = paragraph.runs[0].font.size.pt

        spans.append({"text": text, "size": size, "page": 0})

    return "\n".join(full_text_parts), spans


def extract_text(file_path: Path, extension: str) -> tuple[str, list[Span]]:
    """Dispatches to the correct extractor based on file extension."""
    if extension == ".pdf":
        return extract_text_from_pdf(file_path)
    if extension == ".docx":
        return extract_text_from_docx(file_path)
    raise ValueError(f"Unsupported extension for parsing: {extension}")
