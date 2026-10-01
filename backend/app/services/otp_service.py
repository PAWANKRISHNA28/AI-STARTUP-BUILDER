import random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import OTP

class OTPService:
    @staticmethod
    async def generate_otp(db: AsyncSession, identifier: str, purpose: str = "login", expiry_minutes: int = 10) -> str:
        # In a real-world scenario, you might want to expire or invalidate previous OTPs here
        
        # Generate 6 digit code
        code = f"{random.randint(0, 999999):06d}"
        
        expires_at = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        
        otp_record = OTP(
            identifier=identifier,
            code=code,
            purpose=purpose,
            expires_at=expires_at
        )
        db.add(otp_record)
        await db.commit()
        
        from app.core.config import settings
        
        # Dispatch based on identifier type
        if "@" in identifier:
            from app.services.email_service import EmailService
            subject = "AI Startup Builder Verification Code"
            html_body = f"<p>Your verification code is: <strong>{code}</strong></p><p>This code will expire in {expiry_minutes} minutes.</p>"
            await EmailService.send_email(to_email=identifier, subject=subject, html_body=html_body)
        else:
            # Here we integrate with Twilio to send the code via SMS
            if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_PHONE_NUMBER:
                try:
                    from twilio.rest import Client
                    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                    message = client.messages.create(
                        body=f"Your AI Startup Builder verification code is: {code}",
                        from_=settings.TWILIO_PHONE_NUMBER,
                        to=identifier
                    )
                    print(f"[OTPService] SMS sent via Twilio to {identifier}. Message SID: {message.sid}")
                except Exception as e:
                    print(f"[OTPService] Failed to send SMS via Twilio: {e}")
                    print(f"========== FALLBACK OTP GENERATED ==========")
                    print(f"Identifier: {identifier}")
                    print(f"Code: {code}")
                    print(f"Purpose: {purpose}")
                    print(f"============================================")
            else:
                print(f"========== OTP GENERATED (Mock Mode) ==========")
                print(f"Identifier: {identifier}")
                print(f"Code: {code}")
                print(f"Purpose: {purpose}")
                print(f"===============================================")

        
        return code

    @staticmethod
    async def verify_otp(db: AsyncSession, identifier: str, code: str, purpose: str = "login") -> bool:
        result = await db.execute(
            select(OTP).where(
                OTP.identifier == identifier,
                OTP.code == code,
                OTP.purpose == purpose,
                OTP.is_used == False,
                OTP.expires_at > datetime.utcnow()
            )
        )
        otp_record = result.scalars().first()
        
        if otp_record:
            # Mark as used
            otp_record.is_used = True
            await db.commit()
            return True
            
        return False
