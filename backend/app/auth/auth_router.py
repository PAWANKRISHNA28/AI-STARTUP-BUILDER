from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import uuid

from app.core.database import get_db
from app.models import User, Session, GuestUser, Profile, PasswordReset
from app.schemas import (
    UserCreate, UserLogin, UserResponse, OTPVerify, OTPRequest, 
    GuestLoginRequest, ConvertGuestRequest, ForgotPasswordRequest, 
    ResetPasswordRequest, ProfileUpdate
)
from app.core.security import hash_password as get_password_hash, verify_password, create_access_token, create_refresh_token
from app.auth.deps import get_current_user
from app.services.otp_service import OTPService

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role="founder"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    # Create empty profile but with phone number if provided
    profile = Profile(user_id=user.id, phone_number=user_in.phone_number)
    db.add(profile)
    await db.commit()
    
    return user

@router.post("/login")
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    session = Session(user_id=user.id, refresh_token=refresh_token, expires_at=datetime.utcnow() + timedelta(days=7))
    db.add(session)
    await db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "is_guest": user.role == "guest",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    session = Session(user_id=user.id, refresh_token=refresh_token, expires_at=datetime.utcnow() + timedelta(days=7))
    db.add(session)
    await db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

@router.post("/login/phone")
async def login_phone(data: OTPRequest, db: AsyncSession = Depends(get_db)):
    # Create and "send" OTP
    code = await OTPService.generate_otp(db, identifier=data.identifier, purpose=data.purpose)
    return {"message": "OTP sent to phone", "test_code": code} # test_code added for easy local testing

@router.post("/verify-otp")
async def verify_otp(data: OTPVerify, db: AsyncSession = Depends(get_db)):
    is_valid = await OTPService.verify_otp(db, identifier=data.identifier, code=data.code, purpose=data.purpose)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    # Find user by phone in profile, or create one if it doesn't exist
    result = await db.execute(select(Profile).where(Profile.phone_number == data.identifier))
    profile = result.scalars().first()
    
    if profile:
        user_result = await db.execute(select(User).where(User.id == profile.user_id))
        user = user_result.scalars().first()
    else:
        # Create a new user based on phone number
        dummy_email = f"{data.identifier}@phone.user"
        user = User(
            email=dummy_email,
            full_name="Phone User",
            hashed_password=get_password_hash(str(uuid.uuid4())), # random password
            role="founder"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        new_profile = Profile(user_id=user.id, phone_number=data.identifier)
        db.add(new_profile)
        await db.commit()
        
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    session = Session(user_id=user.id, refresh_token=refresh_token, expires_at=datetime.utcnow() + timedelta(days=7))
    db.add(session)
    await db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "is_guest": False,
        "user": {
            "id": user.id,
            "email": user.email if not user.email.endswith("@phone.user") else None,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.post("/guest")
async def guest_login(data: GuestLoginRequest, db: AsyncSession = Depends(get_db)):
    # Check if this device already has a guest user
    result = await db.execute(select(GuestUser).where(GuestUser.device_id == data.device_id))
    guest_record = result.scalars().first()
    
    if guest_record:
        if guest_record.is_converted:
            # Actually this device already registered, log them in as that user? 
            # For security, they should use normal login if they already converted.
            raise HTTPException(status_code=400, detail="This device has already been registered. Please login normally.")
            
        # Use existing shadow user if not expired, otherwise renew it
        if guest_record.expires_at < datetime.utcnow():
             guest_record.expires_at = datetime.utcnow() + timedelta(days=30)
             await db.commit()
             
        # Extract the user ID (shadow user logic)
        if guest_record.converted_user_id:
            user_result = await db.execute(select(User).where(User.id == guest_record.converted_user_id))
            shadow_user = user_result.scalars().first()
            if shadow_user:
                access_token = create_access_token(subject=shadow_user.id)
                refresh_token = create_refresh_token(subject=shadow_user.id)
                
                return {
                    "access_token": access_token,
                    "token_type": "bearer",
                    "refresh_token": refresh_token,
                    "is_guest": True,
                    "user": {
                        "id": shadow_user.id,
                        "email": shadow_user.email,
                        "full_name": shadow_user.full_name,
                        "role": shadow_user.role
                    }
                }
            
            # If shadow_user was deleted, we should create a new one and update the guest record
            shadow_email = f"guest_{uuid.uuid4().hex[:8]}@example.com"
            shadow_user = User(
                email=shadow_email,
                full_name="Guest User",
                hashed_password=get_password_hash(str(uuid.uuid4())),
                role="guest"
            )
            db.add(shadow_user)
            await db.commit()
            await db.refresh(shadow_user)
            
            guest_record.converted_user_id = shadow_user.id
            await db.commit()
            
            access_token = create_access_token(subject=shadow_user.id)
            refresh_token = create_refresh_token(subject=shadow_user.id)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "refresh_token": refresh_token,
                "is_guest": True,
                "user": {
                    "id": shadow_user.id,
                    "email": shadow_user.email,
                    "full_name": shadow_user.full_name,
                    "role": shadow_user.role
                }
            }

    # Create shadow user
    shadow_email = f"guest_{uuid.uuid4().hex[:8]}@example.com"
    shadow_user = User(
        email=shadow_email,
        full_name="Guest User",
        hashed_password=get_password_hash(str(uuid.uuid4())),
        role="guest"
    )
    db.add(shadow_user)
    await db.commit()
    await db.refresh(shadow_user)
    
    # Create guest record
    new_guest = GuestUser(
        device_id=data.device_id,
        expires_at=datetime.utcnow() + timedelta(days=30),
        is_converted=False,
        converted_user_id=shadow_user.id  # We repurpose this field temporarily to link the shadow user
    )
    db.add(new_guest)
    await db.commit()
    
    access_token = create_access_token(subject=shadow_user.id)
    refresh_token = create_refresh_token(subject=shadow_user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "is_guest": True,
        "user": {
            "id": shadow_user.id,
            "email": shadow_user.email,
            "full_name": shadow_user.full_name,
            "role": shadow_user.role
        }
    }

@router.post("/convert-guest", response_model=UserResponse)
async def convert_guest(
    data: ConvertGuestRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "guest":
        raise HTTPException(status_code=400, detail="User is not a guest")
        
    # Check if email is already taken
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Update the shadow user
    current_user.email = data.email
    current_user.full_name = data.full_name
    current_user.hashed_password = get_password_hash(data.password)
    current_user.role = "founder"
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    # In a real app we would invalidate the refresh token in the DB here
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def read_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.email and current_user.email.endswith("@guest.local"):
        current_user.email = current_user.email.replace("@guest.local", "@example.com")
        db.add(current_user)
        await db.commit()
        await db.refresh(current_user)
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_user_profile(
    data: ProfileUpdate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if data.full_name:
        current_user.full_name = data.full_name
        
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        
    if data.phone_number is not None:
        profile.phone_number = data.phone_number
    if data.avatar_url is not None:
        profile.avatar_url = data.avatar_url
    if data.bio is not None:
        profile.bio = data.bio
        
    await db.commit()
    await db.refresh(current_user)
    
    return current_user

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if not user:
        return {"message": "If an account with that email exists, a reset link has been sent."}
        
    token = str(uuid.uuid4())
    reset_record = PasswordReset(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )
    db.add(reset_record)
    await db.commit()
    
    # Mock sending email
    print(f"========== PASSWORD RESET ==========")
    print(f"Email: {user.email}")
    print(f"Reset Token: {token}")
    print(f"====================================")
    
    return {"message": "If an account with that email exists, a reset link has been sent."}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PasswordReset).where(
            PasswordReset.token == data.token,
            PasswordReset.is_used == False,
            PasswordReset.expires_at > datetime.utcnow()
        )
    )
    reset_record = result.scalars().first()
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    user_result = await db.execute(select(User).where(User.id == reset_record.user_id))
    user = user_result.scalars().first()
    
    user.hashed_password = get_password_hash(data.new_password)
    reset_record.is_used = True
    
    await db.commit()
    
    return {"message": "Password successfully reset"}
