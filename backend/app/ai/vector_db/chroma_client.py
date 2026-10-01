import os
import chromadb
from chromadb.config import Settings
from app.ai.embeddings.gemini_embed import get_embedding_model

CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "chroma_db_data")
os.makedirs(CHROMA_DB_DIR, exist_ok=True)

# Use persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR, settings=Settings(allow_reset=True))

collection_name = "startup_knowledge"

def get_chroma_collection():
    return chroma_client.get_or_create_collection(name=collection_name)

def add_documents_to_chroma(texts, metadatas, ids):
    collection = get_chroma_collection()
    embeddings_model = get_embedding_model()
    
    # Generate embeddings
    embeddings = embeddings_model.embed_documents(texts)
    
    collection.upsert(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

import json
import hashlib
from app.database.redis import get_redis

async def search_documents_cached(query: str, project_id: str, k: int = 5):
    redis = await get_redis()
    cache_key = f"rag_search:{project_id}:{hashlib.sha256(query.encode()).hexdigest()}:{k}"
    
    # Try cache
    try:
        cached = await redis.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception:
        pass
        
    collection = get_chroma_collection()
    embeddings_model = get_embedding_model()
    
    query_embedding = embeddings_model.embed_query(query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=k,
        where={"project_id": project_id}
    )
    
    try:
        await redis.setex(cache_key, 3600, json.dumps(results)) # Cache for 1 hour
    except Exception:
        pass
        
    return results

def delete_documents(document_id: str):
    collection = get_chroma_collection()
    collection.delete(
        where={"document_id": document_id}
    )
