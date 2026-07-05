"""
Aggregates all v1 route modules into a single router.

Why this exists:
- main.py should only know about ONE router (api_router), not every
  individual feature router. As we add auth.py, resume.py, analysis.py
  in later phases, we register them here and main.py stays untouched.
"""

from fastapi import APIRouter
from app.api.v1.routes import health, resume, analysis, dashboard, chat, interview, cover_letter, user

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(health.router)
api_router.include_router(resume.router)
api_router.include_router(analysis.router)
api_router.include_router(dashboard.router)
api_router.include_router(chat.router)
api_router.include_router(interview.router)
api_router.include_router(cover_letter.router)
api_router.include_router(user.router)

# Future routers will be included here, e.g.:
# api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
# api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])
# api_router.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
