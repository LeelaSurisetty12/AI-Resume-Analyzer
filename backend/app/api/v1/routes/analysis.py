from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.resume import Resume, AnalysisResult
from app.services.resume_storage import find_resume_file_by_id
from app.services.resume_parser.parser import parse_resume_file
from app.services.analysis_service import analyze_resume_with_ai

router = APIRouter(prefix="/analysis", tags=["Analysis"])

class AnalyzeRequest(BaseModel):
    resume_id: str
    job_description: str | None = None
    # Assuming the frontend sends the user's Firebase UID so we can associate it.
    # In a real app, this would come from a verified auth token middleware.
    user_id: str

class AnalyzeResponse(BaseModel):
    id: int
    ats_score: int
    matched_skills: list[str]
    missing_skills: list[str]
    improvement_suggestions: list[str]

@router.post("/", response_model=AnalyzeResponse)
async def analyze_resume(req: AnalyzeRequest, db: Session = Depends(get_db)):
    # 1. Fetch or create Resume record (since upload route currently doesn't use DB)
    # Ideally upload route creates the DB record, but since we are bolting this on:
    resume = db.query(Resume).filter(Resume.id == req.resume_id).first()
    if not resume:
        # Create a stub resume record if not found (since previous upload route just saved to disk)
        resume = Resume(
            id=req.resume_id,
            user_id=req.user_id,
            original_filename=f"{req.resume_id}.pdf",
            stored_filename=f"{req.resume_id}.pdf"
        )
        db.add(resume)
        db.commit()

    # 2. Parse the file
    try:
        file_path = find_resume_file_by_id(req.resume_id)
        parsed_data = parse_resume_file(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to parse resume file")

    # Save parsed data
    resume.parsed_data = parsed_data
    db.commit()

    # 3. Call Gemini AI
    ai_result = await analyze_resume_with_ai(parsed_data, req.job_description)

    # 4. Save analysis result
    analysis = AnalysisResult(
        resume_id=req.resume_id,
        job_description=req.job_description,
        ats_score=ai_result.get("ats_score", 0),
        matched_skills=ai_result.get("matched_skills", []),
        missing_skills=ai_result.get("missing_skills", []),
        improvement_suggestions=ai_result.get("improvement_suggestions", [])
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis
