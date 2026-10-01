from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    idea_description: str
    industry: Optional[str] = "Technology"
    country: Optional[str] = "Global"
    budget: Optional[str] = "$50k - $250k"
    business_type: Optional[str] = "B2B SaaS"
    target_users: Optional[str] = "College Students / Young Adults"
    tech_preference: Optional[str] = "React / Python / PostgreSQL"

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    idea_description: Optional[str] = None
    industry: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    business_type: Optional[str] = None
    target_users: Optional[str] = None
    tech_preference: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    current_agent: Optional[str] = None
    favorite: Optional[bool] = None
    pinned: Optional[bool] = None
    last_active_tab: Optional[str] = None
    is_archived: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: str
    status: str
    progress: int
    current_agent: str
    favorite: bool
    pinned: bool
    last_opened: datetime
    last_active_tab: str
    is_archived: bool
    owner_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
