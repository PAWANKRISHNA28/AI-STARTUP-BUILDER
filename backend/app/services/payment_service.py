import uuid
from typing import Optional, Dict, Any
import stripe
from app.core.config import settings

# Initialize Stripe if credential exists
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
    _STRIPE_CONFIGURED = True
else:
    _STRIPE_CONFIGURED = False
    print("[PaymentService] Stripe Secret Key missing. Running in mock mode.")

class PaymentService:
    @staticmethod
    async def create_checkout_session(
        success_url: str,
        cancel_url: str,
        amount: int,
        currency: str = "usd",
        product_name: str = "AI Startup Builder Credits",
        client_reference_id: Optional[str] = None
    ) -> Optional[str]:
        """Create a Stripe Checkout Session and return the URL."""
        if not _STRIPE_CONFIGURED:
            # Mock mode: return a dummy URL
            mock_url = f"https://mock-stripe.com/checkout/{uuid.uuid4().hex}"
            print(f"[PaymentService Mock] Pretending to create checkout session. URL: {mock_url}")
            return mock_url
            
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'unit_amount': amount,
                        'product_data': {
                            'name': product_name,
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=client_reference_id
            )
            return session.url
        except Exception as e:
            print(f"[PaymentService] Failed to create checkout session: {e}")
            return None
