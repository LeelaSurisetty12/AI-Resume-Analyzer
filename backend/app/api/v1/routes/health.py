"""
Health check route.

Why this exists:
- Gives us (and deployment platforms like Render) a simple endpoint to
  verify the API is alive, before any real feature endpoints exist.
- Real feature routes (auth.py, resume.py, analysis.py) will be added
  as siblings to this file in later phases, each with its own router.
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Simple liveness check used by monitoring and deployment platforms."""
    return {"status": "ok", "message": "AI Resume Analyzer API is running"}
