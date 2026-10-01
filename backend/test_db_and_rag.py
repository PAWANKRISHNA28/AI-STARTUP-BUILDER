import asyncio
import os
import sys

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.config import settings

async def test_db():
    print("Testing DB connection...")
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    engine = create_async_engine(db_url)
    try:
        async with engine.begin() as conn:
            # 1. Connection check
            res = await conn.execute(text("SELECT 1"))
            print("DB Connection: SUCCESS")
            
            # 2. Migrations check
            res = await conn.execute(text("SELECT * FROM alembic_version"))
            version = res.scalar()
            print(f"Alembic Version: {version}")
            
            # 3. Knowledge tables check
            res = await conn.execute(text("SELECT count(*) FROM knowledge_documents"))
            doc_count = res.scalar()
            print(f"Knowledge Documents: {doc_count}")
            
            res = await conn.execute(text("SELECT count(*) FROM knowledge_chunks"))
            chunk_count = res.scalar()
            print(f"Knowledge Chunks: {chunk_count}")
    except Exception as e:
        print(f"DB Error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_db())
