from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
import uuid

from database import get_db
import models, schemas, security

router = APIRouter(prefix="/auth", tags=["Authentication"])

def _create_session(db: AsyncSession, user_id: str, request: Request) -> str:
    # Dummy session creation function
    refresh_token = security.create_refresh_token(data={"sub": user_id})
    # In a real app, you would save it to the DB:
    # new_session = models.Session(user_id=user_id, refresh_token=refresh_token, expires_at=...)
    # db.add(new_session)
    return refresh_token

@router.post("/register", response_model=schemas.UserResponse)
async def register(user_in: schemas.UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pwd = security.hash_password(user_in.password)
    new_user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_pwd,
        role="founder"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create profile
    new_profile = models.Profile(user_id=new_user.id, phone_number=user_in.phone_number)
    db.add(new_profile)
    await db.commit()
    
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(user_in: schemas.UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User).where(models.User.email == user_in.email))
    user = result.scalars().first()
    if not user or not security.verify_password(user_in.password, user.hashed_password):
        # Log failure
        new_log = models.LoginHistory(user_id=user.id if user else "unknown", status="failed", ip_address=request.client.host)
        db.add(new_log)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Log success
    new_log = models.LoginHistory(user_id=user.id, status="success", ip_address=request.client.host)
    db.add(new_log)
    
    access_token = security.create_access_token(data={"sub": user.id, "email": user.email})
    refresh_token = _create_session(db, user.id, request)
    await db.commit()
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "is_guest": False}

@router.post("/login/phone")
async def login_phone(req: schemas.OTPRequest, db: AsyncSession = Depends(get_db)):
    # Mock OTP Sending
    print(f"Sending OTP to {req.identifier}")
    # In real world: Generate 6 digit code, save to OTP table, send via Twilio
    new_otp = models.OTP(
        identifier=req.identifier,
        code="123456",  # Mocked OTP code for testing
        purpose=req.purpose,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(new_otp)
    await db.commit()
    return {"message": "OTP sent successfully (Mocked: Use 123456)"}

@router.post("/verify-otp", response_model=schemas.Token)
async def verify_otp(req: schemas.OTPVerify, request: Request, db: AsyncSession = Depends(get_db)):
    # Find OTP
    result = await db.execute(
        select(models.OTP).where(
            models.OTP.identifier == req.identifier,
            models.OTP.code == req.code,
            models.OTP.is_used == False,
            models.OTP.expires_at > datetime.utcnow()
        )
    )
    otp_record = result.scalars().first()
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    otp_record.is_used = True
    
    # Find or Create User based on phone (which means we need to search Profile for phone)
    result = await db.execute(select(models.Profile).where(models.Profile.phone_number == req.identifier))
    profile = result.scalars().first()
    
    if profile:
        user_id = profile.user_id
        result = await db.execute(select(models.User).where(models.User.id == user_id))
        user = result.scalars().first()
    else:
        # Create a new user based on phone? Since phone is primary, we'll create a dummy email
        dummy_email = f"phone_{req.identifier}@example.com"
        user = models.User(email=dummy_email, full_name="Phone User", hashed_password="OTP_LOGIN")
        db.add(user)
        await db.commit()
        await db.refresh(user)
        new_profile = models.Profile(user_id=user.id, phone_number=req.identifier)
        db.add(new_profile)
        await db.commit()
    
    access_token = security.create_access_token(data={"sub": user.id, "email": user.email})
    refresh_token = _create_session(db, user.id, request)
    await db.commit()
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "is_guest": False}

@router.post("/guest", response_model=schemas.Token)
async def guest_login(req: schemas.GuestLogin, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.GuestUser).where(models.GuestUser.device_id == req.device_id))
    guest = result.scalars().first()
    
    if not guest:
        guest = models.GuestUser(device_id=req.device_id, expires_at=datetime.utcnow() + timedelta(days=30))
        db.add(guest)
        await db.commit()
        await db.refresh(guest)
        
    # Generate token with sub = guest.id and a special role
    access_token = security.create_access_token(data={"sub": guest.id, "role": "guest"})
    return {"access_token": access_token, "refresh_token": None, "token_type": "bearer", "is_guest": True}

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(req: schemas.RefreshTokenRequest, request: Request, db: AsyncSession = Depends(get_db)):
    user_id = security.verify_refresh_token(req.refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    access_token = security.create_access_token(data={"sub": user.id, "email": user.email})
    new_refresh_token = _create_session(db, user.id, request)
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer", "is_guest": False}

@router.get("/me", response_model=schemas.UserResponse)
async def get_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user
