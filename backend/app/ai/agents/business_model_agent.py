import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from app.agents.llm_factory import get_llm
from app.core.config import settings

class BusinessModelCanvas(BaseModel):
    key_partners: List[str] = Field(description="Key Partners")
    key_activities: List[str] = Field(description="Key Activities")
    key_resources: List[str] = Field(description="Key Resources")
    value_propositions: List[str] = Field(description="Value Propositions")
    customer_relationships: List[str] = Field(description="Customer Relationships")
    channels: List[str] = Field(description="Channels")
    customer_segments: List[str] = Field(description="Customer Segments")
    cost_structure: List[str] = Field(description="Cost Structure")
    revenue_streams: List[str] = Field(description="Revenue Streams")

class StartupAnalysisOutput(BaseModel):
    executive_summary: str = Field(description="A compelling executive summary")
    problem_statement: str = Field(description="The core problem being solved")
    solution: str = Field(description="The proposed solution")
    value_proposition: str = Field(description="The overarching value proposition")
    business_model_canvas: BusinessModelCanvas = Field(description="The 9 building blocks of the BMC")

class BusinessModelAgent:
    def __init__(self):
        self.llm = get_llm(
            temperature=0.5, 
            require_structured_output=True, 
            structured_schema=StartupAnalysisOutput
        )

    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[BusinessModelAgent] Generating BMC for project {state.get('project_id')}")
        
        project_details = state.get("project_details", "")
        market_data = state.get("market_data", {})
        competitor_data = state.get("competitor_data", {})
        financial_data = state.get("financial_data", {})
        
        if not self.llm:
            # Return Mock Data if no API key
            state["startup_analysis"] = {
                "executive_summary": "Mock Executive Summary.",
                "problem_statement": "Mock Problem.",
                "solution": "Mock Solution.",
                "value_proposition": "Mock VP.",
                "business_model_canvas": {
                    "key_partners": ["Mock Partner"],
                    "key_activities": ["Mock Activity"],
                    "key_resources": ["Mock Resource"],
                    "value_propositions": ["Mock VP"],
                    "customer_relationships": ["Mock Rel"],
                    "channels": ["Mock Channel"],
                    "customer_segments": ["Mock Seg"],
                    "cost_structure": ["Mock Cost"],
                    "revenue_streams": ["Mock Rev"]
                }
            }
            return state

        messages = [
            SystemMessage(content="You are an expert Startup Consultant. Synthesize all previous research into a final Business Model Canvas and Executive Summary. You MUST output strictly to the provided schema."),
            HumanMessage(content=f"Synthesize this startup data:\nIdea: {project_details}\nMarket: {market_data}\nCompetitors: {competitor_data}\nFinancials: {financial_data}")
        ]
        
        try:
            result = await self.llm.ainvoke(messages)
            state["startup_analysis"] = result.dict()
        except Exception as e:
            print(f"[BusinessModelAgent] Error: {e}")
            state["startup_analysis"] = {}
            
        return state
