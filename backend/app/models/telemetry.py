
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin

class ActivityLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'activity_logs'
    user_id = Column(String, ForeignKey('users.id'), nullable=True, index=True)
    action = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    user = relationship("User", back_populates="activity_logs")

class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'notifications'
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, index=True)
    
    user = relationship("User", back_populates="notifications")

class Analytics(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'analytics'
    metric_name = Column(String, nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    dimension = Column(String, nullable=True)
