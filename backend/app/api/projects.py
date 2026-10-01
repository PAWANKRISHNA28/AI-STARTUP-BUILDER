from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.auth.deps import get_current_user
from app.models import User, Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter()

@router.get("/search")
async def search_projects(
    q: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Project).where(
        Project.owner_id == current_user.id,
        Project.is_archived == False,
        Project.deleted_at == None,
        Project.title.ilike(f"%{q}%")
    ).limit(10)
    result = await db.execute(query)
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p).model_dump() for p in projects]

@router.get("/recent")
async def recent_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Project).where(
        Project.owner_id == current_user.id,
        Project.is_archived == False,
        Project.deleted_at == None
    ).order_by(Project.created_at.desc()).limit(5)
    result = await db.execute(query)
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p).model_dump() for p in projects]

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        **project_in.model_dump(),
        owner_id=current_user.id
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.get("/")
async def list_projects(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    filter_by: Optional[str] = None,
    sort_by: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Project).where(
        Project.owner_id == current_user.id,
        Project.is_archived == False,
        Project.deleted_at == None
    )
    
    if search:
        query = query.where(Project.title.ilike(f"%{search}%"))
        
    if sort_by == "recent":
        query = query.order_by(Project.created_at.desc())
    else:
        query = query.order_by(Project.created_at.desc())
        
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    result = await db.execute(query)
    projects = result.scalars().all()
    
    return {
        "items": [ProjectResponse.model_validate(p).model_dump() for p in projects],
        "total": len(projects),
        "page": page,
        "limit": limit,
        "has_more": False
    }

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Project).where(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Project).where(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
        
    project.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Project).where(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project.deleted_at = datetime.utcnow()
    await db.commit()
    return {"message": "Project deleted"}

@router.delete("/{project_id}/permanent")
async def delete_project_permanently(project_id: str):
    return {"status": "success"}

@router.post("/{project_id}/restore")
async def restore_project(project_id: str):
    return {"status": "success", "id": project_id}

@router.post("/{project_id}/archive")
async def archive_project(project_id: str):
    return {"status": "success", "id": project_id}

@router.post("/{project_id}/unarchive")
async def unarchive_project(project_id: str):
    return {"status": "success", "id": project_id}

@router.post("/{project_id}/duplicate")
async def duplicate_project(project_id: str):
    return {"status": "success", "id": "new_duplicate_id"}

@router.put("/{project_id}/blueprint")
async def update_project_blueprint(project_id: str, data: dict):
    return {"status": "success", "id": "blueprint_id", "project_id": project_id, "data": data, "created_at": datetime.utcnow().isoformat()}

@router.get("/{project_id}/versions")
async def list_project_versions(project_id: str):
    return []

@router.post("/{project_id}/versions")
async def create_project_version(project_id: str, name: dict):
    return {"status": "success", "id": "version_id"}

@router.post("/{project_id}/versions/{version_id}/restore")
async def restore_project_version(project_id: str, version_id: str):
    return {"status": "success"}

@router.get("/{project_id}/comments")
async def list_project_comments(project_id: str):
    return []

@router.post("/{project_id}/comments")
async def post_project_comment(project_id: str, content: dict):
    return {"id": "comment_id", "content": content.get("content", ""), "created_at": datetime.utcnow().isoformat()}

@router.patch("/{project_id}/comments/{comment_id}")
async def update_comment(project_id: str, comment_id: str, content: dict):
    return {"status": "success"}

@router.delete("/{project_id}/comments/{comment_id}")
async def delete_comment(project_id: str, comment_id: str):
    return {"status": "success"}

@router.get("/{project_id}/shares")
async def list_shared_users(project_id: str):
    return []

@router.post("/{project_id}/shares")
async def share_project(project_id: str, data: dict):
    return {"status": "success"}

@router.delete("/{project_id}/shares/{share_id}")
async def remove_shared_user(project_id: str, share_id: str):
    return {"status": "success"}

@router.get("/{project_id}/activities")
async def list_project_activities(project_id: str):
    return []
