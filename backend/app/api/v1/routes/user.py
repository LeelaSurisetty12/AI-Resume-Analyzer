from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

class UpdateProfileRequest(BaseModel):
    user_id: str
    email: str = "Unknown"
    full_name: str | None = None
    target_role: str | None = None

@router.get("/me")
async def get_profile(user_id: str, email: str = "Unknown", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Create user lazily if they don't exist
        user = User(id=user_id, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "target_role": user.target_role,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@router.put("/me")
async def update_profile(request: UpdateProfileRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        user = User(id=request.user_id, email=request.email)
        db.add(user)
        
    user.full_name = request.full_name
    user.target_role = request.target_role
    db.commit()
    
    return {"message": "Profile updated successfully"}
