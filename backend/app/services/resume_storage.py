"""
Resume file storage service.

Why this logic lives here, not in the route:
- The route handler's job is to translate HTTP <-> Python. Validation
  and disk I/O are business logic, and belong in `services/` so they
  can be tested or reused (e.g. from a future batch-import script)
  without spinning up FastAPI.

Validation strategy (three layers, cheapest first):
1. Extension check on the filename — instant, catches most mistakes.
2. Size check while streaming — never load a 2GB "resume" fully into
   memory before rejecting it.
3. Magic-byte check on the first chunk — a client can lie about a
   file's extension/content-type, but a real PDF always starts with
   `%PDF` and a real DOCX (a zip archive) always starts with `PK`.
   This catches "rename evil.exe to resume.pdf" attempts.
"""

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

CHUNK_SIZE = 1024 * 1024  # 1MB per read — bounds peak memory usage regardless of file size

ALLOWED_EXTENSIONS = {".pdf", ".docx"}

# Expected leading bytes for each allowed file type.
MAGIC_BYTES = {
    ".pdf": b"%PDF",
    ".docx": b"PK\x03\x04",  # DOCX files are ZIP archives under the hood
}


def _get_extension(filename: str) -> str:
    return Path(filename or "").suffix.lower()


async def save_resume_file(upload_file: UploadFile) -> dict:
    """
    Validates and persists an uploaded resume to local disk.

    Returns a metadata dict on success. Raises HTTPException (400 for
    invalid file, 413 for too large, 500 for storage failure) otherwise.
    Always cleans up any partially-written file before raising.
    """
    extension = _get_extension(upload_file.filename)
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{extension or 'unknown'}'. Only PDF and DOCX are accepted.",
        )

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    destination = upload_dir / stored_filename
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    total_size = 0
    is_first_chunk = True

    try:
        with destination.open("wb") as buffer:
            while True:
                chunk = await upload_file.read(CHUNK_SIZE)
                if not chunk:
                    break

                if is_first_chunk:
                    expected_magic = MAGIC_BYTES[extension]
                    if not chunk.startswith(expected_magic):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="The file's content doesn't match its extension. Please upload a genuine PDF or DOCX.",
                        )
                    is_first_chunk = False

                total_size += len(chunk)
                if total_size > max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB}MB limit.",
                    )

                buffer.write(chunk)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    except Exception as exc:  # noqa: BLE001 - convert any unexpected I/O error into a clean 500
        destination.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store the uploaded file. Please try again.",
        ) from exc

    if total_size == 0:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")

    return {
        "stored_filename": stored_filename,
        "original_filename": upload_file.filename,
        "content_type": upload_file.content_type,
        "size_bytes": total_size,
    }


def find_resume_file_by_id(resume_id: str) -> Path:
    """
    Locates a previously-uploaded resume on disk by its id.

    The id is the UUID portion of the stored filename (extension
    stripped off in the upload response) — so we glob for it since we
    don't know the extension ahead of time without a database lookup.
    Raises 404 if no matching file exists.
    """
    upload_dir = Path(settings.UPLOAD_DIR)
    matches = list(upload_dir.glob(f"{resume_id}.*"))
    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    return matches[0]
