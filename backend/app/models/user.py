
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from datetime import datetime

class Role(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'roles'
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)

class Permission(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'permissions'
    name = Column(String, unique=True, nullable=False, index=True)

class UserRole(Base):
    __tablename__ = 'user_roles'
    user_id = Column(String, ForeignKey('users.id'), primary_key=True, index=True)
    role_id = Column(String, ForeignKey('roles.id'), primary_key=True, index=True)

class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'users'
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    
    # We should add subscription_status and role since schemas use them
    role = Column(String, default="founder")
    subscription_status = Column(String, default="free")

class Profile(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'profiles'
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    phone_number = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)

class Session(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'sessions'
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    refresh_token = Column(String, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)

class GuestUser(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'guest_users'
    device_id = Column(String, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_converted = Column(Boolean, default=False)
    converted_user_id = Column(String, ForeignKey('users.id'), nullable=True)

class PasswordReset(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'password_resets'
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    token = Column(String, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

class OTP(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'otps'
    identifier = Column(String, index=True, nullable=False)
    code = Column(String, nullable=False)
    purpose = Column(String, default="login")
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
