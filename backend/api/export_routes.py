import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
import models, security
from services.json_md_exporter import generate_markdown_report, generate_json_export
from config import settings

router = APIRouter(prefix="/export", tags=["Exports"])

@router.get("/{project_id}/pdf")
async def export_pdf(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint or not blueprint.pdf_file:
        raise HTTPException(status_code=404, detail="PDF report not found")
    
    file_path = os.path.join(settings.EXPORTS_DIR, blueprint.pdf_file)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File on disk missing")
        
    return FileResponse(file_path, media_type="application/pdf", filename=blueprint.pdf_file)


@router.get("/{project_id}/ppt")
async def export_ppt(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint or not blueprint.ppt_file:
        raise HTTPException(status_code=404, detail="PPTX presentation not found")
    
    file_path = os.path.join(settings.EXPORTS_DIR, blueprint.ppt_file)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File on disk missing")
        
    return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", filename=blueprint.ppt_file)


@router.get("/{project_id}/docx")
async def export_docx(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint or not blueprint.docx_file:
        raise HTTPException(status_code=404, detail="DOCX report not found")
    
    file_path = os.path.join(settings.EXPORTS_DIR, blueprint.docx_file)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File on disk missing")
        
    return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename=blueprint.docx_file)


@router.get("/{project_id}/markdown")
async def export_markdown(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint:
        raise HTTPException(status_code=404, detail="Blueprint data not found")
    
    md_content = generate_markdown_report(blueprint.data)
    return Response(content=md_content, media_type="text/markdown", headers={"Content-Disposition": f"attachment; filename=blueprint_{project_id}.md"})


@router.get("/{project_id}/json")
async def export_json(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    res = await db.execute(select(models.Blueprint).where(models.Blueprint.project_id == project_id))
    blueprint = res.scalars().first()
    if not blueprint:
        raise HTTPException(status_code=404, detail="Blueprint data not found")
    
    json_content = generate_json_export(blueprint.data)
    return Response(content=json_content, media_type="application/json", headers={"Content-Disposition": f"attachment; filename=blueprint_{project_id}.json"})
