from fastapi import APIRouter
from typing import Dict, Any, List
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/list")
async def list_notifications() -> List[Dict[str, Any]]:
    return [
        {
            "id": str(uuid.uuid4()),
            "user_id": "test",
            "title": "Welcome to AI Startup Builder",
            "message": "Let's build something great!",
            "type": "general",
            "read": False,
            "created_at": datetime.utcnow().isoformat()
        }
    ]

@router.post("/{notification_id}/read")
async def mark_notification_read(notification_id: str) -> Dict[str, Any]:
    return {"status": "success"}

@router.post("/read-all")
async def mark_all_notifications_read() -> Dict[str, Any]:
    return {"status": "success"}
