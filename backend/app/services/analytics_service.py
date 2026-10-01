from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.system import PlatformAnalytics

class AnalyticsService:
    @classmethod
    async def track_event(cls, db: AsyncSession, metric_name: str, dimension: str = None, value: float = 1.0):
        """Track a system event and save it to the analytics table."""
        try:
            event = PlatformAnalytics(
                metric_name=metric_name,
                metric_value=value,
                dimension=dimension,
                date=datetime.utcnow()
            )
            db.add(event)
            await db.commit()
        except Exception as e:
            print(f"[Analytics] Failed to track event {metric_name}: {e}")
