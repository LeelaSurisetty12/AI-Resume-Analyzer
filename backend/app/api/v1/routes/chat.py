from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import uuid

from app.db.database import get_db
from app.db.models.resume import Resume
from app.db.models.chat import ChatSession, ChatMessage
from app.services.chat_service import chat_with_resume

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatMessageSchema(BaseModel):
    role: str
    content: str
    
class ChatHistoryResponse(BaseModel):
    messages: List[ChatMessageSchema]

class ChatRequest(BaseModel):
    resume_id: str
    message: str

@router.get("/history/{resume_id}", response_model=ChatHistoryResponse)
async def get_chat_history(resume_id: str, db: Session = Depends(get_db)):
    # Find active session
    session = db.query(ChatSession).filter(ChatSession.resume_id == resume_id).first()
    if not session:
        return ChatHistoryResponse(messages=[])
        
    messages = [
        ChatMessageSchema(role=msg.role, content=msg.content)
        for msg in session.messages
    ]
    return ChatHistoryResponse(messages=messages)

@router.post("/message")
async def send_chat_message(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch the resume
    resume = db.query(Resume).filter(Resume.id == request.resume_id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found. Please upload a resume first."
        )
        
    if not resume.parsed_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume has not been successfully parsed yet."
        )

    # 2. Get or create chat session
    session = db.query(ChatSession).filter(ChatSession.resume_id == request.resume_id).first()
    if not session:
        session = ChatSession(id=str(uuid.uuid4()), resume_id=request.resume_id)
        db.add(session)
        db.commit()
        
    # 3. Save user message
    user_msg = ChatMessage(session_id=session.id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # 4. Fetch full history to send to AI
    all_msgs = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at.asc()).all()
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in all_msgs if msg.id != user_msg.id]

    # 5. Call the AI service
    ai_response = await chat_with_resume(
        parsed_resume=resume.parsed_data,
        message=request.message,
        history=history_dicts
    )

    # 6. Save AI message
    ai_msg = ChatMessage(session_id=session.id, role="assistant", content=ai_response)
    db.add(ai_msg)
    db.commit()

    # 7. Return the response
    return {"reply": ai_response}
