from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class ChatMessage(BaseModel):
    project_id: str
    message: str

@router.get("/history/{project_id}")
async def get_chat_history(project_id: str) -> List[Dict[str, Any]]:
    return [
        {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "role": "assistant",
            "message": "Hello! I am your AI assistant. How can I help you build your startup today?",
            "timestamp": datetime.utcnow().isoformat()
        }
    ]

@router.post("/")
async def send_chat_message(chat_in: ChatMessage) -> Dict[str, Any]:
    return {
        "id": str(uuid.uuid4()),
        "project_id": chat_in.project_id,
        "role": "assistant",
        "message": f"I received your message: '{chat_in.message}'. I am a mock AI, but in a real scenario I would process this.",
        "timestamp": datetime.utcnow().isoformat()
    }
