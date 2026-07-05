"""Request/response models for resume endpoints (API contract, kept
separate from db/models — DB schema and API schema are allowed to
diverge, e.g. we may never expose internal row IDs directly)."""

from datetime import datetime

from pydantic import BaseModel, Field


class ResumeUploadResponse(BaseModel):
    id: str = Field(description="Unique identifier for this uploaded file")
    original_filename: str
    content_type: str
    size_bytes: int
    uploaded_at: datetime
    preview_url: str = Field(description="Relative URL where the raw file can be viewed/downloaded")


class ParsedResumeResponse(BaseModel):
    resume_id: str
    name: str | None = Field(description="Best-guess candidate name, or null if not confidently detected")
    email: str | None = None
    phone: str | None = None
    education: list[str] = Field(default_factory=list, description="Line-level content of the Education section")
    experience: list[str] = Field(default_factory=list, description="Line-level content of the Experience section")
    projects: list[str] = Field(default_factory=list, description="Line-level content of the Projects section")
    skills: list[str] = Field(default_factory=list, description="Individual skills, split out of the Skills section")
    research: list[str] = Field(default_factory=list, description="Line-level content of the Research section")
    raw_text_length: int = Field(description="Character count of the extracted text — a diagnostic signal")
    warnings: list[str] = Field(
        default_factory=list,
        description="Sections that were expected but not confidently detected, e.g. missing headers",
    )
