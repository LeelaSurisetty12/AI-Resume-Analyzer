"""
Centralized application settings.

Why this exists:
- Every config value (DB URL, API keys, CORS origins) is read from
  environment variables in ONE place instead of scattered os.getenv()
  calls across the codebase.
- pydantic-settings validates types and fails fast at startup if a
  required variable is missing, instead of crashing later mid-request.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # General
    APP_NAME: str = "AI Resume Analyzer API"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"

    # CORS - comma-separated list of allowed frontend origins
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    # Database
    DATABASE_URL: str = "sqlite:///./resume_analyzer.db"

    # Firebase (filled in during the Auth phase)
    FIREBASE_PROJECT_ID: str = ""

    # Gemini / AI (filled in during the AI phase)
    GEMINI_API_KEY: str = ""

    # Resume upload storage
    UPLOAD_DIR: str = "uploaded_resumes"
    MAX_UPLOAD_SIZE_MB: int = 5

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        """Split the comma-separated ALLOWED_ORIGINS string into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


# Single shared settings instance, imported wherever config is needed.
settings = Settings()
