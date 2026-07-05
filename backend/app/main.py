"""
FastAPI application entry point.

Why this exists:
- Single place where the app is instantiated, middleware is attached,
  and the versioned API router is mounted.
- Keeping this file thin (no business logic) means routes, services,
  and models can be tested in isolation without booting the whole app.
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.database import engine, Base
import app.db.models.user
import app.db.models.resume

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
)

# CORS: allows the Vite frontend (different origin in dev) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded resumes directly so the frontend can preview them
# (e.g. <iframe src=".../uploads/abc123.pdf">). StaticFiles requires
# the directory to exist before mounting, so we create it up front.
#
# NOTE (known limitation, to revisit in a later phase): this mount has
# no auth check — anyone with a stored filename (a random UUID) can
# view it. Fine for local development; once user accounts are wired to
# stored files, swap this for an authenticated download endpoint.
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount all v1 routes under /api/v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    """Root endpoint, mainly useful for a quick sanity check in a browser."""
    return {"message": f"{settings.APP_NAME} — see /docs for API documentation"}
