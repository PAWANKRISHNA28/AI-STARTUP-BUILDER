from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from datetime import datetime
from app.core.database import Base
from app.models.user import generate_uuid

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    upload_status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)

class RecentSearch(Base):
    __tablename__ = "recent_searches"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    search_type = Column(String, nullable=False)  # e.g., 'location', 'competitor', 'idea'
    query = Column(String, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PlatformAnalytics(Base):
    __tablename__ = "analytics"
    id = Column(String, primary_key=True, default=generate_uuid)
    date = Column(DateTime, default=datetime.utcnow)
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float, default=0.0)
    dimension = Column(String, nullable=True)  # e.g., 'tokens_used', 'projects_created'
