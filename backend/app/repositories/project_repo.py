
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.repositories.base import BaseRepository
from app.models.project import Project
from pydantic import BaseModel

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: str

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class ProjectRepository(BaseRepository[Project, ProjectCreate, ProjectUpdate]):
    async def get_by_owner(self, db: AsyncSession, *, owner_id: str, skip: int = 0, limit: int = 100) -> List[Project]:
        result = await db.execute(select(Project).filter(Project.owner_id == owner_id, Project.is_deleted == False).offset(skip).limit(limit))
        return result.scalars().all()

project_repo = ProjectRepository(Project)
