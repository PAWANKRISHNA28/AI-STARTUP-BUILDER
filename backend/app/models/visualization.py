from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.user import generate_uuid

class VisualizationProject(Base):
    __tablename__ = "visualization_projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    business_type = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    brand_style = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    target_audience = Column(String, nullable=True)
    store_size = Column(String, nullable=True)
    number_of_floors = Column(Integer, nullable=True)
    preferred_theme = Column(String, nullable=True)
    color_palette = Column(JSON, nullable=True)
    furniture_style = Column(String, nullable=True)
    lighting_style = Column(String, nullable=True)
    outdoor_seating = Column(Boolean, default=False)
    parking_requirement = Column(Boolean, default=False)
    garden = Column(Boolean, default=False)
    drive_through = Column(Boolean, default=False)
    accessibility_features = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", backref="visualization_projects")

class VisualizationImage(Base):
    __tablename__ = "visualization_images"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    visualization_project_id = Column(String, ForeignKey("visualization_projects.id"), nullable=False)
    concept_name = Column(String, nullable=False)
    view_type = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    style = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class DesignReport(Base):
    __tablename__ = "design_reports"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    visualization_project_id = Column(String, ForeignKey("visualization_projects.id"), nullable=False)
    design_summary = Column(Text, nullable=True)
    business_theme = Column(String, nullable=True)
    architecture_style = Column(String, nullable=True)
    color_palette = Column(JSON, nullable=True)
    material_suggestions = Column(JSON, nullable=True)
    furniture_suggestions = Column(JSON, nullable=True)
    lighting_suggestions = Column(JSON, nullable=True)
    branding_suggestions = Column(JSON, nullable=True)
    smart_suggestions = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class FavoriteDesign(Base):
    __tablename__ = "favorite_designs"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    visualization_image_id = Column(String, ForeignKey("visualization_images.id"), nullable=False)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class BrandStyle(Base):
    __tablename__ = "brand_styles"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    visualization_project_id = Column(String, ForeignKey("visualization_projects.id"), nullable=False)
    store_logo_placement = Column(String, nullable=True)
    sign_board = Column(String, nullable=True)
    menu_board = Column(String, nullable=True)
    reception_branding = Column(String, nullable=True)
    employee_uniform_colors = Column(JSON, nullable=True)
    packaging_style = Column(String, nullable=True)
    business_cards = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
