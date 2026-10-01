from app.vector_db.chroma_client import search_chroma

class KnowledgeRetriever:
    @staticmethod
    def retrieve_context(query: str, n_results: int = 5, filters: dict = None) -> list:
        where_clause = None
        if filters:
            where_clause = filters
            
        results = search_chroma(query, n_results=n_results, where_filter=where_clause)
        
        chunks = []
        if results and results.get("documents") and len(results["documents"]) > 0:
            docs = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0]
            
            for i in range(len(docs)):
                chunks.append({
                    "text": docs[i],
                    "metadata": metadatas[i],
                    "similarity_score": max(0.0, 1.0 - distances[i])
                })
        return chunks
