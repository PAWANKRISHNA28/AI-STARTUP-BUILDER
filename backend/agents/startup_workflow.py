from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END

# ---------------------------------------------------------
# STATE DEFINITION
# ---------------------------------------------------------
class StartupState(TypedDict):
    """
    Holds the contextual data for the AI Startup Builder workflow.
    """
    # Inputs (Step 1)
    project_title: str
    idea_description: str
    industry: str
    country: str
    budget: str
    business_type: str
    target_users: str
    tech_preference: str
    
    # Generated Outputs
    idea_analysis: Dict[str, Any]
    market_research_data: Dict[str, Any]
    competitor_data: Dict[str, Any]
    business_blueprint: Dict[str, Any]
    tech_system_design: Dict[str, Any]
    ui_ux_visualization: Dict[str, Any]
    financial_planning: Dict[str, Any]
    go_to_market_strategy: Dict[str, Any]
    mvp_roadmap: Dict[str, Any]
    investor_pitch_deck: Dict[str, Any]
    export_metadata: Dict[str, Any]


# ---------------------------------------------------------
# AGENT NODES
# ---------------------------------------------------------

def user_input_node(state: StartupState) -> StartupState:
    """Step 1: User Input - Initializes and validates the input state."""
    print("--- 01 User Input ---")
    return state

def ai_idea_analyzer_node(state: StartupState) -> StartupState:
    """Step 2: AI Idea Analyzer - Understands the idea, identifies problem, extracts core features."""
    print("--- 02 AI Idea Analyzer ---")
    state["idea_analysis"] = {
        "status": "completed",
        "validation_score": 90,
        "problem_statement": f"Target audience ({state.get('target_users', 'users')}) needs better solutions in {state.get('industry', 'the industry')}.",
        "core_features": ["User Authentication", "Dashboard", "AI Generation"]
    }
    return state

def market_research_node(state: StartupState) -> StartupState:
    """Step 3: Market Research - Market size & growth, Industry trends, Target audience."""
    print("--- 03 Market Research ---")
    state["market_research_data"] = {
        "status": "completed",
        "tam": "$10 Billion",
        "growth_rate": "15% CAGR",
        "trends": [f"Growing adoption of AI in {state.get('industry', 'tech')}"]
    }
    return state

def competitor_analysis_node(state: StartupState) -> StartupState:
    """Step 4: Competitor Analysis - Top competitors, Strengths & weaknesses, Market positioning."""
    print("--- 04 Competitor Analysis ---")
    state["competitor_data"] = {
        "status": "completed",
        "top_competitors": [{"name": "Competitor A", "weakness": "High Cost"}],
        "market_positioning": "Affordable, AI-first solution."
    }
    return state

def business_blueprint_node(state: StartupState) -> StartupState:
    """Step 5: Business Blueprint - Business model, Revenue streams, Value proposition."""
    print("--- 05 Business Blueprint ---")
    state["business_blueprint"] = {
        "status": "completed",
        "business_model": state.get("business_type", "B2B SaaS"),
        "revenue_streams": ["Subscription Tiers", "API Usage"],
        "value_proposition": "10x faster execution at 1/10th the cost."
    }
    return state

def tech_system_design_node(state: StartupState) -> StartupState:
    """Step 6: Tech & System Design - Tech stack suggestion, System architecture, Key features list."""
    print("--- 06 Tech & System Design ---")
    state["tech_system_design"] = {
        "status": "completed",
        "tech_stack": state.get("tech_preference", "React, Node.js, PostgreSQL"),
        "architecture": "Microservices with event-driven message queues."
    }
    return state

def ui_ux_visualization_node(state: StartupState) -> StartupState:
    """Step 7: UI/UX & Visualization - Wireframes, 3D Visualizations, User flow."""
    print("--- 07 UI/UX & Visualization ---")
    state["ui_ux_visualization"] = {
        "status": "completed",
        "user_flow": "Login -> Dashboard -> Create -> Results",
        "wireframes_generated": True
    }
    return state

def financial_planning_node(state: StartupState) -> StartupState:
    """Step 8: Financial Planning - Cost estimation, Revenue forecast, Profit analysis."""
    print("--- 08 Financial Planning ---")
    state["financial_planning"] = {
        "status": "completed",
        "initial_budget": state.get("budget", "$50k"),
        "revenue_forecast_yr1": "$200,000",
        "break_even": "Month 6"
    }
    return state

def go_to_market_strategy_node(state: StartupState) -> StartupState:
    """Step 9: Go-To-Market Strategy - Marketing plan, Channels & tactics, Customer acquisition."""
    print("--- 09 Go-To-Market Strategy ---")
    state["go_to_market_strategy"] = {
        "status": "completed",
        "primary_channels": ["LinkedIn", "Product Hunt", "SEO Blogs"],
        "cac_estimate": "$25.00"
    }
    return state

def mvp_roadmap_node(state: StartupState) -> StartupState:
    """Step 10: MVP Roadmap - Development roadmap, Milestones, MVP plan."""
    print("--- 10 MVP Roadmap ---")
    state["mvp_roadmap"] = {
        "status": "completed",
        "milestones": ["Month 1: Prototype", "Month 2: Beta Launch", "Month 3: Public Release"]
    }
    return state

def investor_pitch_deck_node(state: StartupState) -> StartupState:
    """Step 11: Investor Pitch Deck - Pitch deck slides, Investor summary, Funding requirements."""
    print("--- 11 Investor Pitch Deck ---")
    state["investor_pitch_deck"] = {
        "status": "completed",
        "slides": 10,
        "funding_ask": "$500,000"
    }
    return state

def export_share_node(state: StartupState) -> StartupState:
    """Step 12: Export & Share - Export report (PDF/Docs), Share with teammates, Save & revisit."""
    print("--- 12 Export & Share ---")
    state["export_metadata"] = {
        "status": "completed",
        "formats_ready": ["PDF", "PPTX", "DOCX", "JSON"]
    }
    return state


# ---------------------------------------------------------
# BUILD THE GRAPH
# ---------------------------------------------------------

def build_startup_workflow_graph():
    workflow = StateGraph(StartupState)

    # Add Nodes (1-12)
    workflow.add_node("01_user_input", user_input_node)
    workflow.add_node("02_ai_idea_analyzer", ai_idea_analyzer_node)
    workflow.add_node("03_market_research", market_research_node)
    workflow.add_node("04_competitor_analysis", competitor_analysis_node)
    workflow.add_node("05_business_blueprint", business_blueprint_node)
    workflow.add_node("06_tech_system_design", tech_system_design_node)
    workflow.add_node("07_ui_ux_visualization", ui_ux_visualization_node)
    workflow.add_node("08_financial_planning", financial_planning_node)
    workflow.add_node("09_go_to_market_strategy", go_to_market_strategy_node)
    workflow.add_node("10_mvp_roadmap", mvp_roadmap_node)
    workflow.add_node("11_investor_pitch_deck", investor_pitch_deck_node)
    workflow.add_node("12_export_share", export_share_node)

    # Set Entry Point
    workflow.set_entry_point("01_user_input")

    # Define Edges (Sequential execution exactly as per image)
    workflow.add_edge("01_user_input", "02_ai_idea_analyzer")
    workflow.add_edge("02_ai_idea_analyzer", "03_market_research")
    workflow.add_edge("03_market_research", "04_competitor_analysis")
    workflow.add_edge("04_competitor_analysis", "05_business_blueprint")
    workflow.add_edge("05_business_blueprint", "06_tech_system_design")
    
    # Boustrophedon continuation (snake-like path in image)
    workflow.add_edge("06_tech_system_design", "07_ui_ux_visualization")
    workflow.add_edge("07_ui_ux_visualization", "08_financial_planning")
    workflow.add_edge("08_financial_planning", "09_go_to_market_strategy")
    workflow.add_edge("09_go_to_market_strategy", "10_mvp_roadmap")
    workflow.add_edge("10_mvp_roadmap", "11_investor_pitch_deck")
    workflow.add_edge("11_investor_pitch_deck", "12_export_share")
    
    # End
    workflow.add_edge("12_export_share", END)

    return workflow.compile()

# Instantiate the compiled graph so it can be imported and run
startup_workflow_graph = build_startup_workflow_graph()

def execute_startup_workflow(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Helper function to safely execute the workflow with default fallback state.
    """
    state: StartupState = {
        "project_title": inputs.get("project_title", "Untitled Project"),
        "idea_description": inputs.get("idea_description", ""),
        "industry": inputs.get("industry", ""),
        "country": inputs.get("country", ""),
        "budget": inputs.get("budget", ""),
        "business_type": inputs.get("business_type", ""),
        "target_users": inputs.get("target_users", ""),
        "tech_preference": inputs.get("tech_preference", ""),
        "idea_analysis": {},
        "market_research_data": {},
        "competitor_data": {},
        "business_blueprint": {},
        "tech_system_design": {},
        "ui_ux_visualization": {},
        "financial_planning": {},
        "go_to_market_strategy": {},
        "mvp_roadmap": {},
        "investor_pitch_deck": {},
        "export_metadata": {}
    }
    
    # Invoke the graph
    result = startup_workflow_graph.invoke(state)
    return result
