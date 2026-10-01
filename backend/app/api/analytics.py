from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_analytics() -> Dict[str, Any]:
    return {
        "projects_created": 5,
        "reports_generated": 10,
        "most_used_industry": "Technology",
        "average_generation_time_seconds": 45,
        "total_ai_requests": 120,
        "favorite_projects_count": 2,
        "agent_performance": [
            {"agent": "Idea Analyzer", "accuracy": 95, "speed": "Fast"},
            {"agent": "Market Research", "accuracy": 90, "speed": "Medium"}
        ],
        "weekly_usage": [
            {"day": "Mon", "requests": 10},
            {"day": "Tue", "requests": 20},
            {"day": "Wed", "requests": 15},
            {"day": "Thu", "requests": 25},
            {"day": "Fri", "requests": 30},
            {"day": "Sat", "requests": 10},
            {"day": "Sun", "requests": 10}
        ],
        "monthly_usage": [
            {"month": "Jan", "projects": 1, "reports": 2},
            {"month": "Feb", "projects": 4, "reports": 8}
        ]
    }

@router.get("/agents/{project_id}")
async def get_agent_analytics(project_id: str) -> Dict[str, Any]:
    return {
        "project_id": project_id,
        "agent_logs": []
    }
