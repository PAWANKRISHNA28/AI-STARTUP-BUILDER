from typing import Dict, Any, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, END
from app.agents.master_agent import MasterAgent
from app.agents.market_agent import MarketAgent
from app.agents.competitor_agent import CompetitorAgent
from app.agents.financial_agent import FinancialAgent
from app.agents.business_model_agent import BusinessModelAgent
from app.core.database import AsyncSessionLocal
from app.models.knowledge import KnowledgeDocument
from app.models.analysis import StartupAnalysis, MarketResearch, CompetitorAnalysis, FinancialAnalysis
from sqlalchemy import select

class ChatAgentState(TypedDict):
    project_id: str
    session_id: str
    messages: Annotated[list, operator.add]

def create_chat_orchestrator():
    workflow = StateGraph(ChatAgentState)
    master = MasterAgent()
    
    async def run_master(state: ChatAgentState):
        return await master.execute(state)
        
    workflow.add_node("master", run_master)
    workflow.set_entry_point("master")
    workflow.add_edge("master", END)
    
    return workflow.compile()

orchestrator_app = create_chat_orchestrator()

# --- Multi-Agent Startup Builder Pipeline ---

class StartupBuilderState(TypedDict):
    project_id: str
    project_details: str
    market_data: dict
    competitor_data: dict
    financial_data: dict
    startup_analysis: dict

def create_startup_builder_pipeline():
    workflow = StateGraph(StartupBuilderState)
    
    market_agent = MarketAgent()
    competitor_agent = CompetitorAgent()
    financial_agent = FinancialAgent()
    bmc_agent = BusinessModelAgent()
    
    async def run_market(state: StartupBuilderState):
        return await market_agent.execute(state)
        
    async def run_competitor(state: StartupBuilderState):
        return await competitor_agent.execute(state)
        
    async def run_financial(state: StartupBuilderState):
        return await financial_agent.execute(state)
        
    async def run_bmc(state: StartupBuilderState):
        return await bmc_agent.execute(state)
        
    async def save_to_db(state: StartupBuilderState):
        project_id = state.get("project_id")
        print(f"[Database] Saving AI Analysis for project {project_id}")
        
        async with AsyncSessionLocal() as session:
            # 1. Market Research
            if state.get("market_data"):
                res = await session.execute(select(MarketResearch).where(MarketResearch.project_id == project_id))
                mr = res.scalars().first()
                if not mr:
                    mr = MarketResearch(project_id=project_id)
                    session.add(mr)
                md = state["market_data"]
                mr.tam_sam_som = md.get("tam_sam_som")
                mr.target_demographics = md.get("target_demographics")
                mr.market_trends = md.get("market_trends")
                mr.swot_analysis = md.get("swot_analysis")

            # 2. Competitor Analysis
            if state.get("competitor_data"):
                res = await session.execute(select(CompetitorAnalysis).where(CompetitorAnalysis.project_id == project_id))
                ca = res.scalars().first()
                if not ca:
                    ca = CompetitorAnalysis(project_id=project_id)
                    session.add(ca)
                cd = state["competitor_data"]
                ca.direct_competitors = cd.get("direct_competitors")
                ca.indirect_competitors = cd.get("indirect_competitors")
                ca.competitive_advantage = cd.get("competitive_advantage")

            # 3. Financial Analysis
            if state.get("financial_data"):
                res = await session.execute(select(FinancialAnalysis).where(FinancialAnalysis.project_id == project_id))
                fa = res.scalars().first()
                if not fa:
                    fa = FinancialAnalysis(project_id=project_id)
                    session.add(fa)
                fd = state["financial_data"]
                fa.revenue_streams = fd.get("revenue_streams")
                fa.cost_structure = fd.get("cost_structure")
                fa.pricing_strategy = fd.get("pricing_strategy")
                fa.break_even_point = fd.get("break_even_point")
                fa.funding_requirements = fd.get("funding_requirements")

            # 4. Startup Analysis (BMC)
            if state.get("startup_analysis"):
                res = await session.execute(select(StartupAnalysis).where(StartupAnalysis.project_id == project_id))
                sa = res.scalars().first()
                if not sa:
                    sa = StartupAnalysis(project_id=project_id)
                    session.add(sa)
                sd = state["startup_analysis"]
                sa.executive_summary = sd.get("executive_summary")
                sa.problem_statement = sd.get("problem_statement")
                sa.solution = sd.get("solution")
                sa.value_proposition = sd.get("value_proposition")
                
                bmc = sd.get("business_model_canvas")
                if hasattr(bmc, "dict"):
                    sa.business_model_canvas = bmc.dict()
                else:
                    sa.business_model_canvas = bmc

            from app.services.analytics_service import AnalyticsService
            # 5. Project Memory (Learning System)
            if state.get("startup_analysis"):
                sd = state["startup_analysis"]
                fd = state.get("financial_data", {})
                cd = state.get("competitor_data", {})
                md = state.get("market_data", {})
                pm = ProjectMemory(
                    project_id=project_id,
                    problem=sd.get("problem_statement"),
                    solution=sd.get("solution"),
                    industry="Startup",
                    revenue_model=fd.get("revenue_streams", "Unknown"),
                    financial_plan=fd,
                    pitch=sd.get("executive_summary"),
                    marketing_plan=md,
                    competitor_analysis=cd
                )
                session.add(pm)
                # Also create a search context in ChromaDB if needed
            await AnalyticsService.track_event(session, "startup_analyzed")
            await session.commit()
            
        return state

    workflow.add_node("market", run_market)
    workflow.add_node("competitor", run_competitor)
    workflow.add_node("financial", run_financial)
    workflow.add_node("bmc", run_bmc)
    workflow.add_node("save", save_to_db)
    
    # Sequential execution
    workflow.set_entry_point("market")
    workflow.add_edge("market", "competitor")
    workflow.add_edge("competitor", "financial")
    workflow.add_edge("financial", "bmc")
    workflow.add_edge("bmc", "save")
    workflow.add_edge("save", END)
    
    return workflow.compile()

startup_builder_app = create_startup_builder_pipeline()
