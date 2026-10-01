import asyncio
import os
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db, AsyncSessionLocal
import models, schemas, security
from agents.agent_registry import MultiAgentEngine
from services.pdf_exporter import generate_pdf_report
from services.ppt_exporter import generate_ppt_pitch_deck
from services.docx_exporter import generate_docx_report
from config import settings

router = APIRouter(prefix="/agent", tags=["Multi-Agent Engine"])

async def run_generation_background(project_id: str):
    async with AsyncSessionLocal() as db:
        # Load Project
        res = await db.execute(select(models.Project).where(models.Project.id == project_id))
        project = res.scalars().first()
        if not project:
            return

        project.status = "generating"
        project.progress = 0
        project.current_agent = "Initializing Agents..."
        await db.commit()

        async def progress_cb(agent_key: str, agent_name: str, status: str, message: str, progress: int, execution_time: float):
            async with AsyncSessionLocal() as cb_db:
                # Log entry
                log_entry = models.AgentLog(
                    project_id=project_id,
                    agent_key=agent_key,
                    agent_name=agent_name,
                    status=status,
                    message=message,
                    execution_time_seconds=execution_time
                )
                cb_db.add(log_entry)
                
                # Update Project State
                proj_res = await cb_db.execute(select(models.Project).where(models.Project.id == project_id))
                p = proj_res.scalars().first()
                if p:
                    p.progress = progress
                    p.current_agent = agent_name
                    if progress >= 100:
                        p.status = "completed"
                await cb_db.commit()

        try:
            results = await MultiAgentEngine.execute_full_pipeline(
                project_title=project.title,
                idea_description=project.idea_description,
                industry=project.industry,
                country=project.country,
                budget=project.budget,
                business_type=project.business_type,
                target_users=project.target_users,
                tech_preference=project.tech_preference,
                progress_callback=progress_cb
            )

            # Generate File Reports
            pdf_filename = f"blueprint_{project_id}.pdf"
            ppt_filename = f"pitchdeck_{project_id}.pptx"
            docx_filename = f"report_{project_id}.docx"

            pdf_path = os.path.join(settings.EXPORTS_DIR, pdf_filename)
            ppt_path = os.path.join(settings.EXPORTS_DIR, ppt_filename)
            docx_path = os.path.join(settings.EXPORTS_DIR, docx_filename)

            generate_pdf_report(results, pdf_path)
            generate_ppt_pitch_deck(results, ppt_path)
            generate_docx_report(results, docx_path)

            # Save Blueprint
            blueprint = models.Blueprint(
                project_id=project_id,
                data=results,
                pdf_file=pdf_filename,
                ppt_file=ppt_filename,
                docx_file=docx_filename
            )
            db.add(blueprint)

            p_res = await db.execute(select(models.Project).where(models.Project.id == project_id))
            p = p_res.scalars().first()
            if p:
                p.status = "completed"
                p.progress = 100
                p.current_agent = "Execution Finished"
            await db.commit()

        except Exception as e:
            p_res = await db.execute(select(models.Project).where(models.Project.id == project_id))
            p = p_res.scalars().first()
            if p:
                p.status = "failed"
                p.current_agent = f"Error: {str(e)}"
            await db.commit()


@router.post("/generate/{project_id}")
async def trigger_generation(
    project_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    background_tasks.add_task(run_generation_background, project_id)
    return {"status": "started", "message": f"Generation started for project {project.title}"}


@router.get("/status/{project_id}", response_model=schemas.GenerationStatusResponse)
async def get_generation_status(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Project).where(models.Project.id == project_id, models.Project.owner_id == current_user.id))
    project = res.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    logs_res = await db.execute(
        select(models.AgentLog)
        .where(models.AgentLog.project_id == project_id)
        .order_by(models.AgentLog.timestamp.asc())
    )
    logs = logs_res.scalars().all()

    return {
        "project_id": project.id,
        "status": project.status,
        "progress": project.progress,
        "current_agent": project.current_agent,
        "logs": logs
    }


@router.get("/blueprint/{project_id}", response_model=schemas.BlueprintResponse)
async def get_blueprint(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint:
        raise HTTPException(status_code=404, detail="Blueprint not found or still generating")
    return blueprint
