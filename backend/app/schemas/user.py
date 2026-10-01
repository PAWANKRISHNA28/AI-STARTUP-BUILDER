from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    phone_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    subscription_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class OTPVerify(BaseModel):
    identifier: str
    code: str
    purpose: str = "login"

class OTPRequest(BaseModel):
    identifier: str
    purpose: str = "login"

class GuestLoginRequest(BaseModel):
    device_id: str

class ConvertGuestRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

