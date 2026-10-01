from sqlalchemy import Column, DateTime, Boolean, String
from sqlalchemy.ext.declarative import declared_attr
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UUIDMixin:
    id = Column(String, primary_key=True, default=generate_uuid, index=True)

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, index=True)
    deleted_at = Column(DateTime, nullable=True)
