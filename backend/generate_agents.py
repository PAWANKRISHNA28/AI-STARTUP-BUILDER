import os

base_dir = r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\ai'
agents_dir = os.path.join(base_dir, 'agents')

# Agents mapping
agents = {
    'research_agent.py': ('ResearchAgent', 'ResearchResult'),
    'market_agent.py': ('MarketAgent', 'MarketResult'),
    'finance_agent.py': ('FinanceAgent', 'FinanceResult'),
    'competitor_agent.py': ('CompetitorAgent', 'CompetitorResult'),
    'branding_agent.py': ('BrandingAgent', 'BrandingResult'),
    'pricing_agent.py': ('PricingAgent', 'PricingResult'),
    'marketing_agent.py': ('MarketingAgent', 'MarketingResult'),
    'investor_agent.py': ('InvestorAgent', 'InvestorResult'),
    'technology_agent.py': ('TechnologyAgent', 'TechnologyResult'),
    'ui_ux_agent.py': ('UIUXAgent', 'UIUXResult'),
    'database_agent.py': ('DatabaseAgent', 'DatabaseResult')
}

agent_template = """
from app.ai.agents.base import BaseAgent
from app.schemas.blueprint import {schema_name}

class {agent_name}(BaseAgent):
    def __init__(self):
        super().__init__(name=\"{agent_name}\")
        self.system_instruction = \"You are an expert {agent_name} for an AI Startup Builder. Return only strictly valid JSON matching the requested schema. Analyze the project context deeply.\"

    async def run(self, project_context: str, extra_data: str = \"\") -> {schema_name}:
        prompt = f\"Project Context:\\n{{project_context}}\\n\\nAdditional Data:\\n{{extra_data}}\\n\\nPlease provide your professional analysis.\"
        return await self.execute(
            system_instruction=self.system_instruction,
            prompt=prompt,
            response_schema={schema_name}
        )
"""

for filename, (agent_name, schema_name) in agents.items():
    code = agent_template.format(agent_name=agent_name, schema_name=schema_name)
    with open(os.path.join(agents_dir, filename), 'w') as f:
        f.write(code)

# Orchestrator
orchestrator_code = """
import asyncio
import logging
from typing import Dict, Any, Optional
from app.schemas.blueprint import StartupBlueprint
from app.ai.agents.research_agent import ResearchAgent
from app.ai.agents.market_agent import MarketAgent
from app.ai.agents.finance_agent import FinanceAgent
from app.ai.agents.competitor_agent import CompetitorAgent
from app.ai.agents.branding_agent import BrandingAgent
from app.ai.agents.pricing_agent import PricingAgent
from app.ai.agents.marketing_agent import MarketingAgent
from app.ai.agents.investor_agent import InvestorAgent
from app.ai.agents.technology_agent import TechnologyAgent
from app.ai.agents.ui_ux_agent import UIUXAgent
from app.ai.agents.database_agent import DatabaseAgent

logger = logging.getLogger(__name__)

class AIOrchestrator:
    def __init__(self, project_id: str):
        self.project_id = project_id
        
    async def run_pipeline(self, project_context: str) -> StartupBlueprint:
        blueprint = StartupBlueprint(project_id=self.project_id)
        
        # Phase 1: Research
        logger.info(f"[{self.project_id}] Phase 1: Research")
        research_agent = ResearchAgent()
        research_res = await research_agent.run(project_context)
        blueprint.research = research_res
        
        enhanced_context = f"{project_context}\\n\\nResearch Summary:\\n{research_res.summary}"
        
        # Phase 2: Parallel Scatter
        logger.info(f"[{self.project_id}] Phase 2: Parallel Scatter (10 Agents)")
        agents = [
            (MarketAgent(), 'market'),
            (FinanceAgent(), 'finance'),
            (CompetitorAgent(), 'competitor'),
            (BrandingAgent(), 'branding'),
            (PricingAgent(), 'pricing'),
            (MarketingAgent(), 'marketing'),
            (InvestorAgent(), 'investor'),
            (TechnologyAgent(), 'technology'),
            (UIUXAgent(), 'ui_ux'),
            (DatabaseAgent(), 'database')
        ]
        
        tasks = []
        for agent, attr in agents:
            tasks.append(agent.run(enhanced_context))
            
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Phase 3: Gather & Map
        logger.info(f"[{self.project_id}] Phase 3: Gather & Merge")
        for i, (agent, attr) in enumerate(agents):
            res = results[i]
            if isinstance(res, Exception):
                logger.error(f"Agent {agent.name} failed: {res}")
            else:
                setattr(blueprint, attr, res)
                
        return blueprint
"""

with open(os.path.join(base_dir, 'orchestrator.py'), 'w') as f:
    f.write(orchestrator_code)
