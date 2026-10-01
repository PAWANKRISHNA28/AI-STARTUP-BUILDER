import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.models import User, Profile
from app.core.security import hash_password

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "you@example.com"))
        if not result.scalars().first():
            user = User(
                email="you@example.com",
                full_name="Example User",
                hashed_password=hash_password("password123"),
                role="founder"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
            profile = Profile(user_id=user.id)
            db.add(profile)
            await db.commit()
            print("Seeded you@example.com with password 'password123'")
        else:
            print("User you@example.com already exists.")

if __name__ == "__main__":
    asyncio.run(seed())
