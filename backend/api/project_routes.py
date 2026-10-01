from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, func

from database import get_db
import models, schemas, security

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=schemas.ProjectResponse)
async def create_project(
    proj_in: schemas.ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    new_project = models.Project(
        title=proj_in.title,
        idea_description=proj_in.idea_description,
        industry=proj_in.industry,
        country=proj_in.country,
        budget=proj_in.budget,
        business_type=proj_in.business_type,
        target_users=proj_in.target_users,
        tech_preference=proj_in.tech_preference,
        status="draft",
        progress=0,
        current_agent="Idle",
        owner_id=current_user.id
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    # Add tags if any
    if proj_in.tags:
        for tag in proj_in.tags:
            new_tag = models.ProjectTag(project_id=new_project.id, name=tag.name, color=tag.color)
            db.add(new_tag)
        await db.commit()
        await db.refresh(new_project)

    # Log activity
    activity = models.ActivityLog(
        project_id=new_project.id,
        activity_type="created",
        description=f"Created project '{new_project.title}'"
    )
    db.add(activity)
    await db.commit()

    return new_project

@router.get("", response_model=schemas.ProjectListResponse)
async def list_projects(
    page: int = 1,
    limit: int = 10,
    search: Optional[str] = None,
    filter_by: Optional[str] = None,
    sort_by: Optional[str] = "newest_first",
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Base Query
    query = select(models.Project).options(
        selectinload(models.Project.tags),
        selectinload(models.Project.shares)
    ).where(models.Project.owner_id == current_user.id)

    count_query = select(func.count(models.Project.id)).where(models.Project.owner_id == current_user.id)

    # Soft Delete & Archive filter bounds
    if filter_by == "trash":
        query = query.where(models.Project.deleted_at != None)
        count_query = count_query.where(models.Project.deleted_at != None)
    elif filter_by == "archived":
        query = query.where(models.Project.is_archived == True, models.Project.deleted_at == None)
        count_query = count_query.where(models.Project.is_archived == True, models.Project.deleted_at == None)
    else:
        query = query.where(models.Project.deleted_at == None, models.Project.is_archived == False)
        count_query = count_query.where(models.Project.deleted_at == None, models.Project.is_archived == False)

    # Search filter (Project Name, Industry, Description, Keywords, etc.)
    if search:
        search_term = f"%{search}%"
        search_filter = or_(
            models.Project.title.ilike(search_term),
            models.Project.industry.ilike(search_term),
            models.Project.idea_description.ilike(search_term),
            models.Project.target_users.ilike(search_term),
            models.Project.tech_preference.ilike(search_term),
            models.Project.keywords.ilike(search_term)
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    # Additional Filters
    now = datetime.utcnow()
    date_filter = None
    if filter_by == "today":
        today_start = datetime(now.year, now.month, now.day)
        date_filter = models.Project.created_at >= today_start
    elif filter_by == "yesterday":
        today_start = datetime(now.year, now.month, now.day)
        yesterday_start = today_start - timedelta(days=1)
        date_filter = and_(models.Project.created_at >= yesterday_start, models.Project.created_at < today_start)
    elif filter_by == "last_7_days":
        seven_days_ago = now - timedelta(days=7)
        date_filter = models.Project.created_at >= seven_days_ago
    elif filter_by == "last_30_days":
        thirty_days_ago = now - timedelta(days=30)
        date_filter = models.Project.created_at >= thirty_days_ago
    elif filter_by == "completed":
        query = query.where(models.Project.status == "completed")
        count_query = count_query.where(models.Project.status == "completed")
    elif filter_by == "draft":
        query = query.where(models.Project.status == "draft")
        count_query = count_query.where(models.Project.status == "draft")
    elif filter_by == "in_progress":
        query = query.where(models.Project.status == "generating")
        count_query = count_query.where(models.Project.status == "generating")
    elif filter_by == "favorites":
        query = query.where(models.Project.favorite == True)
        count_query = count_query.where(models.Project.favorite == True)
    elif filter_by == "pinned":
        query = query.where(models.Project.pinned == True)
        count_query = count_query.where(models.Project.pinned == True)
    elif filter_by == "shared":
        # Shared project has shared records
        query = query.join(models.SharedProject).where(models.SharedProject.id != None)
        count_query = count_query.join(models.SharedProject).where(models.SharedProject.id != None)

    if date_filter is not None:
        query = query.where(date_filter)
        count_query = count_query.where(date_filter)

    # Sorting
    if sort_by == "oldest":
        query = query.order_by(models.Project.created_at.asc())
    elif sort_by == "recently_opened":
        query = query.order_by(models.Project.last_opened.desc())
    elif sort_by == "alphabetical":
        query = query.order_by(models.Project.title.asc())
    elif sort_by == "most_used":
        query = query.order_by(models.Project.use_count.desc())
    elif sort_by == "most_viewed":
        query = query.order_by(models.Project.view_count.desc())
    else:  # newest
        query = query.order_by(models.Project.created_at.desc())

    # Count total
    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    # Paginate
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    # Fetch
    result = await db.execute(query)
    items = result.scalars().all()

    has_more = (offset + len(items)) < total

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "has_more": has_more
    }

@router.get("/notifications/list", response_model=List[schemas.NotificationResponse])
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Notification)
        .where(models.Notification.user_id == current_user.id)
        .order_by(models.Notification.created_at.desc())
    )
    return result.scalars().all()

@router.post("/notifications/{notification_id}/read")
async def read_notification(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Notification)
        .where(models.Notification.id == notification_id, models.Notification.user_id == current_user.id)
    )
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    await db.commit()
    return {"status": "success"}

@router.get("/analytics/summary", response_model=schemas.AnalyticsResponse)
async def get_analytics_summary(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Total projects created
    count_proj = await db.execute(select(func.count(models.Project.id)).where(models.Project.owner_id == current_user.id))
    total_proj = count_proj.scalar() or 0

    # Total completed (reports generated)
    count_completed = await db.execute(select(func.count(models.Project.id)).where(models.Project.owner_id == current_user.id, models.Project.status == "completed"))
    reports_gen = count_completed.scalar() or 0

    # Most used industry
    industry_query = await db.execute(
        select(models.Project.industry, func.count(models.Project.id))
        .where(models.Project.owner_id == current_user.id)
        .group_by(models.Project.industry)
        .order_by(func.count(models.Project.id).desc())
        .limit(1)
    )
    top_ind_res = industry_query.first()
    top_ind = top_ind_res[0] if top_ind_res else "Technology"

    # Favorite projects count
    count_fav = await db.execute(select(func.count(models.Project.id)).where(models.Project.owner_id == current_user.id, models.Project.favorite == True))
    total_fav = count_fav.scalar() or 0

    # Average generation time (simulate 145 seconds or parse logs)
    avg_dur = 142.5

    # Mock agent performance, weekly usage, monthly usage charts for frontend Recharts
    agent_perf = [
        {"agent": "Idea Analyzer", "accuracy": 94, "speed": "0.3s"},
        {"agent": "Market Research", "accuracy": 89, "speed": "0.3s"},
        {"agent": "Competitor Analysis", "accuracy": 92, "speed": "0.3s"},
        {"agent": "Database Designer", "accuracy": 95, "speed": "0.3s"},
        {"agent": "Financial Planner", "accuracy": 90, "speed": "0.3s"}
    ]
    
    weekly_use = [
        {"day": "Mon", "requests": 12},
        {"day": "Tue", "requests": 24},
        {"day": "Wed", "requests": 18},
        {"day": "Thu", "requests": 34},
        {"day": "Fri", "requests": 40},
        {"day": "Sat", "requests": 15},
        {"day": "Sun", "requests": 8}
    ]

    monthly_use = [
        {"month": "Jan", "projects": 2, "reports": 1},
        {"month": "Feb", "projects": 5, "reports": 3},
        {"month": "Mar", "projects": 8, "reports": 6},
        {"month": "Apr", "projects": 12, "reports": 10},
        {"month": "May", "projects": 18, "reports": 15},
        {"month": "Jun", "projects": total_proj, "reports": reports_gen}
    ]

    return {
        "projects_created": total_proj,
        "reports_generated": reports_gen,
        "most_used_industry": top_ind,
        "average_generation_time_seconds": avg_dur,
        "total_ai_requests": total_proj * 24,
        "favorite_projects_count": total_fav,
        "agent_performance": agent_perf,
        "weekly_usage": weekly_use,
        "monthly_usage": monthly_use
    }

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).options(
            selectinload(models.Project.tags),
            selectinload(models.Project.shares)
        ).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Increment view count and update last opened timestamp
    project.view_count += 1
    project.last_opened = datetime.utcnow()
    await db.commit()
    await db.refresh(project)
    return project

@router.patch("/{project_id}", response_model=schemas.ProjectResponse)
async def update_project(
    project_id: str,
    proj_in: schemas.ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = proj_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(project)
    return project

# Soft-Delete (Move to Trash)
@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Soft delete: set deleted_at
    project.deleted_at = datetime.utcnow()
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="deleted",
        description=f"Moved project '{project.title}' to Trash"
    )
    db.add(activity)
    
    await db.commit()
    return {"status": "success", "message": "Project moved to Trash"}

# Hard-Delete (Permanent Delete)
@router.delete("/{project_id}/permanent")
async def permanent_delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()
    return {"status": "success", "message": "Project permanently deleted"}

# Restore from Trash
@router.post("/{project_id}/restore", response_model=schemas.ProjectResponse)
async def restore_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.deleted_at = None
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="restored",
        description=f"Restored project '{project.title}' from Trash"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(project)
    return project

# Archive
@router.post("/{project_id}/archive", response_model=schemas.ProjectResponse)
async def archive_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.is_archived = True
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="archived",
        description=f"Archived project '{project.title}'"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(project)
    return project

# Unarchive
@router.post("/{project_id}/unarchive", response_model=schemas.ProjectResponse)
async def unarchive_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.is_archived = False
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="unarchived",
        description=f"Unarchived project '{project.title}'"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(project)
    return project

# Duplicate Project
@router.post("/{project_id}/duplicate", response_model=schemas.ProjectResponse)
async def duplicate_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Project)
        .options(selectinload(models.Project.blueprint), selectinload(models.Project.tags))
        .where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_project = models.Project(
        title=f"Copy of {project.title}",
        idea_description=project.idea_description,
        industry=project.industry,
        country=project.country,
        budget=project.budget,
        business_type=project.business_type,
        target_users=project.target_users,
        tech_preference=project.tech_preference,
        status=project.status,
        progress=project.progress,
        current_agent=project.current_agent,
        favorite=False,
        pinned=False,
        owner_id=current_user.id
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    if project.blueprint:
        new_blueprint = models.Blueprint(
            project_id=new_project.id,
            data=project.blueprint.data,
            pdf_file=project.blueprint.pdf_file,
            ppt_file=project.blueprint.ppt_file,
            docx_file=project.blueprint.docx_file
        )
        db.add(new_blueprint)
        
    for tag in project.tags:
        new_tag = models.ProjectTag(project_id=new_project.id, name=tag.name, color=tag.color)
        db.add(new_tag)

    # Duplicate agent logs
    logs_result = await db.execute(
        select(models.AgentLog).where(models.AgentLog.project_id == project.id)
    )
    logs = logs_result.scalars().all()
    for log in logs:
        new_log = models.AgentLog(
            project_id=new_project.id,
            agent_key=log.agent_key,
            agent_name=log.agent_name,
            status=log.status,
            message=log.message,
            execution_time_seconds=log.execution_time_seconds,
            timestamp=log.timestamp
        )
        db.add(new_log)

    # Log activity
    activity = models.ActivityLog(
        project_id=new_project.id,
        activity_type="created",
        description=f"Duplicated project '{project.title}'"
    )
    db.add(activity)

    await db.commit()
    return new_project

# Update blueprint (Auto-Save Endpoint)
@router.put("/{project_id}/blueprint", response_model=schemas.BlueprintResponse)
async def update_project_blueprint(
    project_id: str,
    blueprint_data: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    proj_res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = proj_res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    bp_res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = bp_res.scalars().first()
    if not blueprint:
        blueprint = models.Blueprint(project_id=project_id, data=blueprint_data)
        db.add(blueprint)
    else:
        blueprint.data = blueprint_data
    
    project.use_count += 1
    project.updated_at = datetime.utcnow()

    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="edited",
        description=f"Saved project configurations"
    )
    db.add(activity)

    await db.commit()
    await db.refresh(blueprint)
    return blueprint

# ====================================================================
# CHAT LOGS
# ====================================================================

@router.get("/{project_id}/chat", response_model=List[schemas.ProjectChatResponse])
async def get_project_chat(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.ProjectChat)
        .where(models.ProjectChat.project_id == project_id)
        .order_by(models.ProjectChat.timestamp.asc())
    )
    return result.scalars().all()

@router.post("/{project_id}/chat", response_model=schemas.ProjectChatResponse)
async def send_project_message(
    project_id: str,
    chat_in: schemas.ProjectChatCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    p_res = await db.execute(
        select(models.Project)
        .options(selectinload(models.Project.blueprint))
        .where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = p_res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user_msg = models.ProjectChat(
        project_id=project_id,
        role="user",
        message=chat_in.message
    )
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)

    user_query = chat_in.message.lower()
    blueprint_data = project.blueprint.data if project.blueprint else None
    
    # Context-aware co-founder response builder
    if "database" in user_query or "schema" in user_query or "sql" in user_query:
        if blueprint_data and "database_designer" in blueprint_data:
            tables = blueprint_data["database_designer"].get("tables", [])
            tables_str = ", ".join([t.get("name", "") for t in tables])
            reply = f"I've fetched your database structure for **{project.title}**.\n\nIt features the following primary tables: `{tables_str}`.\n\nYou can review full SQL script constraints in the **Tech Architecture & DB** workspace tab."
        else:
            reply = f"I am structuring a PostgreSQL schema covering users, orders, and payment integrations. The schema details will update dynamically once the agent graph finishes execution."
    elif "competitor" in user_query or "market" in user_query or "tam" in user_query:
        if blueprint_data and "market_research" in blueprint_data:
            m_res = blueprint_data["market_research"]
            reply = f"Here is our market outline for **{project.title}**:\n\n* **TAM**: {m_res.get('tam', '$42.5 Billion')}\n* **SAM**: {m_res.get('sam', '$8.2 Billion')}\n* **SOM**: {m_res.get('som', '$450 Million')}\n\nYou can see comparative competitor matrix grids inside the **Market & Competitors** tab."
        else:
            reply = f"Analyzing target TAM markets for **{project.title}**... We expect a promising growth CAGR. Let's run a complete agent cycle to get refined market metrics."
    else:
        reply = f"Hi! As your AI Co-founder, I'm ready to continue building **{project.title}** (category: *{project.industry}*). Ask me about database architecture, milestones, pricing strategies, or pitch structures!"

    assistant_msg = models.ProjectChat(
        project_id=project_id,
        role="assistant",
        message=reply
    )
    db.add(assistant_msg)
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="edited",
        description=f"Sent chat prompt to AI Co-founder"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(assistant_msg)
    return assistant_msg

# ====================================================================
# PROJECT VERSIONS
# ====================================================================

@router.get("/{project_id}/versions", response_model=List[schemas.ProjectVersionResponse])
async def list_project_versions(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Verify owner
    p_res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    if not p_res.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")

    result = await db.execute(
        select(models.ProjectVersion)
        .where(models.ProjectVersion.project_id == project_id)
        .order_by(models.ProjectVersion.version_number.desc())
    )
    return result.scalars().all()

@router.post("/{project_id}/versions", response_model=schemas.ProjectVersionResponse)
async def create_project_version(
    project_id: str,
    ver_in: schemas.ProjectVersionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    p_res = await db.execute(
        select(models.Project)
        .options(selectinload(models.Project.blueprint))
        .where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = p_res.scalars().first()
    if not project or not project.blueprint:
        raise HTTPException(status_code=404, detail="Project or completed blueprint not found")

    # Get max version number
    v_res = await db.execute(
        select(func.max(models.ProjectVersion.version_number))
        .where(models.ProjectVersion.project_id == project_id)
    )
    max_ver = v_res.scalar() or 0
    next_ver = max_ver + 1

    new_version = models.ProjectVersion(
        project_id=project_id,
        version_number=next_ver,
        name=ver_in.name,
        data=project.blueprint.data
    )
    db.add(new_version)
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="created",
        description=f"Created snapshot version {next_ver}: '{ver_in.name}'"
    )
    db.add(activity)

    await db.commit()
    await db.refresh(new_version)
    return new_version

@router.post("/{project_id}/versions/{version_id}/restore", response_model=schemas.ProjectResponse)
async def restore_project_version(
    project_id: str,
    version_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    p_res = await db.execute(
        select(models.Project)
        .options(selectinload(models.Project.blueprint))
        .where(models.Project.id == project_id, models.Project.owner_id == current_user.id)
    )
    project = p_res.scalars().first()
    if not project or not project.blueprint:
        raise HTTPException(status_code=404, detail="Project not found")

    v_res = await db.execute(
        select(models.ProjectVersion)
        .where(models.ProjectVersion.id == version_id, models.ProjectVersion.project_id == project_id)
    )
    version = v_res.scalars().first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")

    # Restore data
    project.blueprint.data = version.data
    
    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="restored",
        description=f"Restored workspace state to version {version.version_number}: '{version.name}'"
    )
    db.add(activity)

    await db.commit()
    return project

# ====================================================================
# COMMENTS
# ====================================================================

@router.get("/{project_id}/comments", response_model=List[schemas.CommentResponse])
async def list_project_comments(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.Comment)
        .where(models.Comment.project_id == project_id)
        .order_by(models.Comment.created_at.asc())
    )
    return result.scalars().all()

@router.post("/{project_id}/comments", response_model=schemas.CommentResponse)
async def post_project_comment(
    project_id: str,
    comm_in: schemas.CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Verify access
    p_res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    if not p_res.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")

    new_comment = models.Comment(
        project_id=project_id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        content=comm_in.content
    )
    db.add(new_comment)

    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="comment_added",
        description=f"{current_user.full_name} commented: \"{comm_in.content[:40]}...\""
    )
    db.add(activity)

    await db.commit()
    await db.refresh(new_comment)
    return new_comment

# ====================================================================
# TEAM SHARING
# ====================================================================

@router.get("/{project_id}/shares", response_model=List[schemas.SharedProjectResponse])
async def list_shared_users(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    result = await db.execute(
        select(models.SharedProject)
        .where(models.SharedProject.project_id == project_id)
    )
    return result.scalars().all()

@router.post("/{project_id}/shares", response_model=schemas.SharedProjectResponse)
async def share_project_with_user(
    project_id: str,
    share_in: schemas.SharedProjectInvite,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    p_res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = p_res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_share = models.SharedProject(
        project_id=project_id,
        user_email=str(share_in.user_email),
        role=share_in.role
    )
    db.add(new_share)

    # Log activity
    activity = models.ActivityLog(
        project_id=project_id,
        activity_type="shared",
        description=f"Shared project with {share_in.user_email} as {share_in.role}"
    )
    db.add(activity)

    await db.commit()
    await db.refresh(new_share)
    return new_share

# ====================================================================
# NOTIFICATIONS
# ====================================================================
# End of file
