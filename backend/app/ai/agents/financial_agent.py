import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.llm_factory import get_llm
from app.core.config import settings

class FinancialAnalysisOutput(BaseModel):
    revenue_streams: List[Dict[str, str]] = Field(description="List of revenue streams with keys: 'name', 'description'")
    cost_structure: List[Dict[str, str]] = Field(description="List of costs with keys: 'category', 'description'")
    pricing_strategy: List[Dict[str, str]] = Field(description="Pricing tiers or strategies with keys: 'tier', 'price', 'features'")
    break_even_point: str = Field(description="Estimated break-even point timeline")
    funding_requirements: str = Field(description="Estimated funding required to reach break-even")

class FinancialAgent:
    def __init__(self):
        self.llm = get_llm(
            temperature=0.2, 
            require_structured_output=True, 
            structured_schema=FinancialAnalysisOutput
        )

    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[FinancialAgent] Analyzing financials for project {state.get('project_id')}")
        
        project_details = state.get("project_details", "")
        market_data = state.get("market_data", {})
        competitor_data = state.get("competitor_data", {})
        
        if not self.llm:
            # Return Mock Data if no API key
            state["financial_data"] = {
                "revenue_streams": [{"name": "SaaS Subscription", "description": "$20/mo"}],
                "cost_structure": [{"category": "Cloud Hosting", "description": "AWS"}],
                "pricing_strategy": [{"tier": "Pro", "price": "$20", "features": "All features"}],
                "break_even_point": "Month 18",
                "funding_requirements": "$500,000 Seed Round"
            }
            return state

        messages = [
            SystemMessage(content="You are an expert Financial Analyst for startups. Provide detailed financial modeling. You MUST output strictly to the provided schema."),
            HumanMessage(content=f"Analyze financials for this startup idea: {project_details}\nMarket: {market_data}\nCompetitors: {competitor_data}")
        ]
        
        try:
            result = await self.llm.ainvoke(messages)
            state["financial_data"] = result.dict()
        except Exception as e:
            print(f"[FinancialAgent] Error: {e}")
            state["financial_data"] = {}
            
        return state
