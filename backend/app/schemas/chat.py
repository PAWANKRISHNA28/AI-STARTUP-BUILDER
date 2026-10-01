from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class ChatSessionBase(BaseModel):
    title: str = "New Conversation"
    is_pinned: bool = False

class ChatSessionCreate(ChatSessionBase):
    project_id: str

class ChatSessionResponse(ChatSessionBase):
    id: str
    project_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    role: str
    message: str

class ChatMessageCreate(ChatMessageBase):
    project_id: str
    session_id: Optional[str] = None

class ChatMessageResponse(ChatMessageBase):
    id: str
    project_id: str
    session_id: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    project_id: str
    session_id: Optional[str] = None
    message: str
    agent_id: Optional[str] = "master"
