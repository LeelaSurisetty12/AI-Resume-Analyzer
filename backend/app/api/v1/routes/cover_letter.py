from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from app.db.database import get_db
from app.db.models.resume import Resume
from app.db.models.cover_letter import CoverLetter
from app.services.cover_letter_service import generate_cover_letter

router = APIRouter(prefix="/cover-letter", tags=["Cover Letter"])

class GenerateCoverLetterRequest(BaseModel):
    resume_id: str
    company_name: str | None = None
    job_description: str | None = None

@router.post("/generate")
async def generate_letter(request: GenerateCoverLetterRequest, db: Session = Depends(get_db)):
    # 1. Fetch the resume
    resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found. Please upload a resume first."
        )
        
    if not resume.parsed_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume has not been successfully parsed yet."
        )

    # 2. Generate cover letter via AI
    content = await generate_cover_letter(
        parsed_resume=resume.parsed_data,
        company_name=request.company_name,
        job_description=request.job_description
    )

    # 3. Save to database
    letter_id = str(uuid.uuid4())
    cover_letter = CoverLetter(
        id=letter_id,
        resume_id=request.resume_id,
        company_name=request.company_name,
        job_description=request.job_description,
        content=content
    )
    db.add(cover_letter)
    db.commit()

    return {"letter_id": letter_id, "content": content}

@router.get("/latest/{resume_id}")
async def get_latest_cover_letter(resume_id: str, db: Session = Depends(get_db)):
    letter = db.query(CoverLetter).filter(CoverLetter.resume_id == resume_id).order_by(CoverLetter.created_at.desc()).first()
    
    if not letter:
        return {"has_letter": False}
        
    return {
        "has_letter": True,
        "letter_id": letter.id,
        "company_name": letter.company_name,
        "job_description": letter.job_description,
        "content": letter.content
    }
