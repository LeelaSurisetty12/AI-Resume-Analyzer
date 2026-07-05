from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from app.db.database import get_db
from app.db.models.resume import Resume
from app.db.models.interview import InterviewSession
from app.services.interview_service import generate_interview_questions

router = APIRouter(prefix="/interview", tags=["Interview"])

class GenerateInterviewRequest(BaseModel):
    resume_id: str
    job_description: str | None = None

@router.post("/generate")
async def generate_questions(request: GenerateInterviewRequest, db: Session = Depends(get_db)):
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

    # 2. Generate questions via AI
    questions = await generate_interview_questions(
        parsed_resume=resume.parsed_data,
        job_description=request.job_description
    )

    # 3. Save to database
    session_id = str(uuid.uuid4())
    interview_session = InterviewSession(
        id=session_id,
        resume_id=request.resume_id,
        job_description=request.job_description,
        questions=questions
    )
    db.add(interview_session)
    db.commit()

    return {"session_id": session_id, "questions": questions}

@router.get("/latest/{resume_id}")
async def get_latest_interview(resume_id: str, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.resume_id == resume_id).order_by(InterviewSession.created_at.desc()).first()
    
    if not session:
        return {"has_session": False}
        
    return {
        "has_session": True,
        "session_id": session.id,
        "job_description": session.job_description,
        "questions": session.questions
    }
