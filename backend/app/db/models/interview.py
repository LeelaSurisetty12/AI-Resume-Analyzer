from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.resume import Resume

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    resume_id: Mapped[str] = mapped_column(String, ForeignKey("resumes.id"))
    job_description: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # Store the generated questions and hints as JSON
    # [{"question": "...", "hint": "..."}]
    questions: Mapped[list] = mapped_column(JSON)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    resume: Mapped["Resume"] = relationship("Resume")
