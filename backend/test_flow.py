import asyncio
import uuid
import logging
from app.ai.orchestrator import AIOrchestrator
from app.ai.agents.base import BaseAgent
from app.schemas.blueprint import ResearchResult, MarketResult

logging.basicConfig(level=logging.INFO)

# Monkey-patch BaseAgent.execute to intercept and print prompt
async def mock_execute(self, system_instruction, prompt, response_schema):
    print(f"\nAGENT NAME:\n{self.name}")
    print(f"AGENT INPUT:\n{prompt}")
    print(f"AGENT OUTPUT SUMMARY:\nMocked {self.name} summary")
    
    # Return mock data based on schema
    if self.name == "ResearchAgent":
        return ResearchResult(summary=f"Mocked Research for: {prompt[:30]}...", key_findings=[], industry_overview="")
    return response_schema.construct()

BaseAgent.execute = mock_execute

async def main():
    print("RUN A:\ninput -> endpoint -> workflow state -> agent inputs -> final output\n")
    
    project_id_1 = str(uuid.uuid4())
    idea_1 = "AI-powered crop disease detection for farmers"
    print(f"INPUT RECEIVED:\n{idea_1}")
    
    orch_1 = AIOrchestrator(project_id_1)
    res_1 = await orch_1.run_pipeline(idea_1)
    
    print(f"\nFINAL RESULT IDEA:\n{res_1.research.summary if res_1.research else 'None'}\n\n")

    print("RUN B:\ninput -> endpoint -> workflow state -> agent inputs -> final output\n")
    
    project_id_2 = str(uuid.uuid4())
    idea_2 = "Online tutoring marketplace for college students"
    print(f"INPUT RECEIVED:\n{idea_2}")
    
    orch_2 = AIOrchestrator(project_id_2)
    res_2 = await orch_2.run_pipeline(idea_2)
    
    print(f"\nFINAL RESULT IDEA:\n{res_2.research.summary if res_2.research else 'None'}\n")

if __name__ == "__main__":
    asyncio.run(main())
