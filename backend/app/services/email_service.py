import resend
from app.core.config import settings

# Initialize Resend if credential exists
if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY
    _RESEND_CONFIGURED = True
else:
    _RESEND_CONFIGURED = False
    print("[EmailService] Resend API Key missing. Running in mock mode.")

class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, html_body: str, from_email: str = "onboarding@resend.dev") -> bool:
        """Send an email using Resend."""
        if not _RESEND_CONFIGURED:
            print(f"========== MOCK EMAIL ==========")
            print(f"To: {to_email}")
            print(f"From: {from_email}")
            print(f"Subject: {subject}")
            print(f"Body: {html_body}")
            print(f"================================")
            return True
            
        try:
            # Send the email
            response = resend.Emails.send({
                "from": from_email,
                "to": to_email,
                "subject": subject,
                "html": html_body
            })
            print(f"[EmailService] Email sent to {to_email}. ID: {response.get('id')}")
            return True
        except Exception as e:
            print(f"[EmailService] Failed to send email: {e}")
            return False
