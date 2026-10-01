
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
        logger.info(f"[{self.project_id}] Phase 1: Research (with RAG)")
        research_agent = ResearchAgent()
        research_res = await research_agent.run(project_context, project_id=self.project_id)
        blueprint.research = research_res
        
        enhanced_context = f"{project_context}\n\nResearch Summary:\n{research_res.summary}"
        
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
            logger.info(f"AGENT:\n{agent.name}")
            logger.info(f"INPUT IDEA:\n{project_context}")
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
