import uuid
import json
import random
from sqlalchemy.orm import Session
from datetime import datetime
from models import (
    VisualizationProject,
    VisualizationImage,
    DesignReport,
    BrandStyle,
    FavoriteDesign
)
from schemas import VisualizationProjectCreate

class VisualizationService:
    @staticmethod
    async def create_visualization_project(db: Session, data: VisualizationProjectCreate):
        # 1. Create Project Entry
        db_project = VisualizationProject(
            project_id=data.project_id,
            business_type=data.business_type,
            business_name=data.business_name,
            brand_style=data.brand_style,
            budget=data.budget,
            target_audience=data.target_audience,
            store_size=data.store_size,
            number_of_floors=data.number_of_floors,
            preferred_theme=data.preferred_theme,
            color_palette=data.color_palette,
            furniture_style=data.furniture_style,
            lighting_style=data.lighting_style,
            outdoor_seating=data.outdoor_seating,
            parking_requirement=data.parking_requirement,
            garden=data.garden,
            drive_through=data.drive_through,
            accessibility_features=data.accessibility_features
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)

        # 2. Simulate AI Design Agents generating Concepts A, B, C, D, E
        concepts = ["Concept A", "Concept B", "Concept C", "Concept D", "Concept E"]
        views = [
            "Exterior Concept", "Interior Concept", "Reception", 
            "Waiting Area", "Seating Layout", "Counter Design", 
            "Brand Signboard", "Outdoor View", "Night View", 
            "Day View", "Parking Area", "Garden", "Entrance"
        ]
        
        styles = ["Modern", "Luxury", "Minimal", "Industrial", "Eco Friendly"]

        # Mock image URLs - using placehold.co for visual demonstration
        def get_placeholder(concept, view):
            color = random.choice(["4F46E5", "3B82F6", "14B8A6", "1E293B", "0F172A"])
            text = f"{concept.replace(' ', '+')}+{view.replace(' ', '+')}"
            return f"https://placehold.co/800x600/{color}/FFFFFF/png?text={text}"

        for i, concept in enumerate(concepts):
            style = styles[i % len(styles)]
            for view in views:
                # Add conditional rendering (don't generate garden if not requested, etc.)
                if view == "Garden" and not data.garden: continue
                if view == "Parking Area" and not data.parking_requirement: continue
                
                db_image = VisualizationImage(
                    visualization_project_id=db_project.id,
                    concept_name=concept,
                    view_type=view,
                    image_url=get_placeholder(concept, view),
                    style=style
                )
                db.add(db_image)

        # 3. Generate Design Report
        db_report = DesignReport(
            visualization_project_id=db_project.id,
            design_summary=f"AI generated design for {data.business_name} blending {data.preferred_theme} elements.",
            business_theme=data.preferred_theme,
            architecture_style=data.brand_style,
            color_palette=data.color_palette or ["#ffffff", "#000000"],
            material_suggestions=["Sustainable Wood", "Brushed Steel", "Tempered Glass", "Polished Concrete"],
            furniture_suggestions=["Ergonomic seating", "Minimalist desks", "Lounge chairs"],
            lighting_suggestions=["Warm LED track lighting", "Pendant lights", "Natural sunlight optimization"],
            branding_suggestions=["Subtle logo placement", "Neon signs", "Monochrome accents"],
            smart_suggestions=[
                "Upgrade lighting to improve customer dwell time by 15%.",
                "Shift counter layout to reduce bottleneck during peak hours.",
                "Use eco-friendly packaging to align with target audience."
            ]
        )
        db.add(db_report)

        # 4. Generate Brand Style
        db_brand = BrandStyle(
            visualization_project_id=db_project.id,
            store_logo_placement="Above main entrance and on reception desk",
            sign_board="Backlit acrylic 3D letters",
            menu_board="Digital screens behind the counter",
            reception_branding="Engraved logo on stone counter",
            employee_uniform_colors=["#4F46E5", "#1E293B"],
            packaging_style="Minimalist recycled paper bags",
            business_cards="Matte finish with spot UV logo"
        )
        db.add(db_brand)
        
        db.commit()
        db.refresh(db_project)

        return db_project

    @staticmethod
    async def get_project_full(db: Session, vis_project_id: str):
        project = db.query(VisualizationProject).filter(VisualizationProject.id == vis_project_id).first()
        if not project:
            return None
        images = db.query(VisualizationImage).filter(VisualizationImage.visualization_project_id == vis_project_id).all()
        report = db.query(DesignReport).filter(DesignReport.visualization_project_id == vis_project_id).first()
        brand = db.query(BrandStyle).filter(BrandStyle.visualization_project_id == vis_project_id).first()
        
        return {
            "project": project,
            "images": images,
            "report": report,
            "brand_style": brand
        }

    @staticmethod
    async def toggle_favorite(db: Session, user_id: str, image_id: str, notes: str = None):
        existing = db.query(FavoriteDesign).filter(
            FavoriteDesign.user_id == user_id,
            FavoriteDesign.visualization_image_id == image_id
        ).first()
        
        if existing:
            db.delete(existing)
            db.commit()
            return {"status": "removed"}
        else:
            fav = FavoriteDesign(
                user_id=user_id,
                visualization_image_id=image_id,
                notes=notes
            )
            db.add(fav)
            db.commit()
            return {"status": "added"}
