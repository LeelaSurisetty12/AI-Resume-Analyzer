"""
Resume upload and parsing routes.

Kept intentionally thin: parse the request, delegate validation/storage
/parsing to the service layer, and shape the response.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.resume import ParsedResumeResponse, ResumeUploadResponse
from app.services.resume_parser.parser import parse_resume_file
from app.services.resume_storage import find_resume_file_by_id, save_resume_file
from app.db.database import get_db
from app.db.models.resume import Resume
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts a single PDF or DOCX file, validates it, and stores it on
    local disk. Returns metadata including a preview_url the frontend
    can render directly (e.g. in an <iframe> for PDFs).
    """
    metadata = await save_resume_file(file)

    # The stored filename is `{uuid}{extension}` — reuse the uuid as
    # the public-facing id rather than exposing the full filename twice.
    file_id = metadata["stored_filename"].rsplit(".", 1)[0]

    return ResumeUploadResponse(
        id=file_id,
        original_filename=metadata["original_filename"],
        content_type=metadata["content_type"],
        size_bytes=metadata["size_bytes"],
        uploaded_at=datetime.now(timezone.utc),
        preview_url=f"/uploads/{metadata['stored_filename']}",
    )


@router.get("/{resume_id}/parse", response_model=ParsedResumeResponse)
async def parse_resume(resume_id: str):
    """
    Parses a previously-uploaded resume (by the id returned from
    /upload) into structured fields: name, email, phone, education,
    experience, projects, skills, research.

    This is a GET, not a POST, because it has no side effects — it
    only reads the already-stored file and computes a result.
    """
    file_path = find_resume_file_by_id(resume_id)

    try:
        parsed = parse_resume_file(file_path)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 - never leak a raw parser traceback to the client
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse this resume. It may be corrupted or in an unsupported layout.",
        ) from exc

    return ParsedResumeResponse(resume_id=resume_id, **parsed)

@router.get("/latest")
async def get_latest_resume(user_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
    if not resume:
        return {}
    return {"id": resume.id}
