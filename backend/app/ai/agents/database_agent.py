
from app.ai.agents.base import BaseAgent
from app.schemas.blueprint import DatabaseResult

class DatabaseAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="DatabaseAgent")
        self.system_instruction = "You are an expert DatabaseAgent for an AI Startup Builder. Return only strictly valid JSON matching the requested schema. Analyze the project context deeply."

    async def run(self, project_context: str, extra_data: str = "") -> DatabaseResult:
        prompt = f"Project Context:\n{project_context}\n\nAdditional Data:\n{extra_data}\n\nPlease provide your professional analysis."
        return await self.execute(
            system_instruction=self.system_instruction,
            prompt=prompt,
            response_schema=DatabaseResult
        )
