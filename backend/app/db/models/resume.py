from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.user import User

class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    
    original_filename: Mapped[str] = mapped_column(String)
    stored_filename: Mapped[str] = mapped_column(String)
    
    # The structured data extracted from the resume
    parsed_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="resumes")
    analysis_results: Mapped[list["AnalysisResult"]] = relationship(
        "AnalysisResult", back_populates="resume", cascade="all, delete-orphan"
    )

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    resume_id: Mapped[str] = mapped_column(String, ForeignKey("resumes.id"))
    
    # Optional context the resume was analyzed against
    job_description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # AI Output
    ats_score: Mapped[int] = mapped_column(Integer)
    matched_skills: Mapped[list] = mapped_column(JSON)
    missing_skills: Mapped[list] = mapped_column(JSON)
    improvement_suggestions: Mapped[list] = mapped_column(JSON)
    
    analyzed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    resume: Mapped["Resume"] = relationship("Resume", back_populates="analysis_results")
