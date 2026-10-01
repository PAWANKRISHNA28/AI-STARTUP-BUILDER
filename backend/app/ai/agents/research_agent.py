from app.ai.agents.base import BaseAgent
from app.schemas.blueprint import ResearchResult
from app.ai.vector_db.chroma_client import search_documents_cached

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ResearchAgent")
        self.system_instruction = "You are an expert ResearchAgent for an AI Startup Builder. Return only strictly valid JSON matching the requested schema. Analyze the project context deeply."

    async def run(self, project_context: str, project_id: str = "", extra_data: str = "") -> ResearchResult:
        # RAG Injection
        rag_context = ""
        if project_id:
            try:
                # Ask RAG for general startup context
                search_results = await search_documents_cached("business plan, competitors, financial model, technical architecture", project_id, k=5)
                if search_results and "documents" in search_results and len(search_results["documents"]) > 0:
                    rag_context = "Knowledge Base Extracts:\n"
                    for doc in search_results["documents"][0]:
                        rag_context += f"- {doc}\n"
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"RAG search failed for project {project_id}: {e}")

        prompt = f"Project Context:\n{project_context}\n\n{rag_context}\n\nAdditional Data:\n{extra_data}\n\nPlease provide your professional analysis."
        
        return await self.execute(
            system_instruction=self.system_instruction,
            prompt=prompt,
            response_schema=ResearchResult
        )
