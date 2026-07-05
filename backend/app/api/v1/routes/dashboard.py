from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.models.resume import Resume, AnalysisResult

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(user_id: str = "anonymous", db: Session = Depends(get_db)):
    # Get total resumes uploaded by user
    total_resumes = db.query(Resume).filter(Resume.user_id == user_id).count()
    
    # Get all analysis results for the user's resumes
    analysis_results = (
        db.query(AnalysisResult.ats_score)
        .join(Resume, Resume.id == AnalysisResult.resume_id)
        .filter(Resume.user_id == user_id)
        .all()
    )
    
    total_analyses = len(analysis_results)
    avg_score = 0
    if total_analyses > 0:
        avg_score = sum([r.ats_score for r in analysis_results]) / total_analyses
        
    return {
        "total_resumes": total_resumes,
        "total_analyses": total_analyses,
        "average_score": round(avg_score)
    }

@router.get("/recent")
def get_recent_analyses(user_id: str = "anonymous", db: Session = Depends(get_db)):
    # Fetch 5 most recent analyses
    recent = (
        db.query(AnalysisResult, Resume.original_filename)
        .join(Resume, Resume.id == AnalysisResult.resume_id)
        .filter(Resume.user_id == user_id)
        .order_by(AnalysisResult.analyzed_at.desc())
        .limit(5)
        .all()
    )
    
    return [
        {
            "id": r.AnalysisResult.id,
            "resume_id": r.AnalysisResult.resume_id,
            "filename": r.original_filename,
            "ats_score": r.AnalysisResult.ats_score,
            "analyzed_at": r.AnalysisResult.analyzed_at.isoformat()
        } for r in recent
    ]

@router.get("/trend")
def get_score_trend(user_id: str = "anonymous", db: Session = Depends(get_db)):
    # Fetch up to 10 most recent analyses in ascending order to plot a trend
    trend = (
        db.query(AnalysisResult.ats_score, AnalysisResult.analyzed_at)
        .join(Resume, Resume.id == AnalysisResult.resume_id)
        .filter(Resume.user_id == user_id)
        .order_by(AnalysisResult.analyzed_at.asc())
        .limit(10)
        .all()
    )
    
    return [
        {
            "score": t.ats_score,
            "date": t.analyzed_at.isoformat()
        } for t in trend
    ]

@router.get("/history")
def get_history(user_id: str = "anonymous", db: Session = Depends(get_db)):
    # Fetch all analyses with full data
    history = (
        db.query(AnalysisResult, Resume.original_filename)
        .join(Resume, Resume.id == AnalysisResult.resume_id)
        .filter(Resume.user_id == user_id)
        .order_by(AnalysisResult.analyzed_at.desc())
        .all()
    )
    
    return [
        {
            "id": r.AnalysisResult.id,
            "resume_id": r.AnalysisResult.resume_id,
            "filename": r.original_filename,
            "ats_score": r.AnalysisResult.ats_score,
            "matched_skills": r.AnalysisResult.matched_skills,
            "missing_skills": r.AnalysisResult.missing_skills,
            "improvement_suggestions": r.AnalysisResult.improvement_suggestions,
            "analyzed_at": r.AnalysisResult.analyzed_at.isoformat()
        } for r in history
    ]
