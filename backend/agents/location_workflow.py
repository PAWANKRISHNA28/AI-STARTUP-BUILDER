from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage
import json

# Define the state for the LangGraph workflow
class LocationState(TypedDict):
    business_type: str
    target_customers: str
    budget: str
    city: str
    radius: int
    
    # Accumulated Data
    candidate_locations: List[Dict[str, Any]]
    competitors: List[Dict[str, Any]]
    accessibility_data: Dict[str, Any]
    population_data: Dict[str, Any]
    traffic_data: Dict[str, Any]
    rental_data: Dict[str, Any]
    growth_data: Dict[str, Any]
    risk_data: Dict[str, Any]
    financial_data: Dict[str, Any]
    
    # Final Output
    recommendation: Dict[str, Any]
    final_score: float

# ---------------------------------------------------------
# AGENT NODES
# ---------------------------------------------------------

def business_analysis_agent(state: LocationState) -> LocationState:
    """1. Understand business type."""
    # Mock analysis
    print("--- Business Analysis Agent ---")
    return state

def location_search_agent(state: LocationState) -> LocationState:
    """2. Find candidate locations."""
    print("--- Location Search Agent ---")
    state["candidate_locations"] = [{"lat": 37.7749, "lng": -122.4194, "address": state.get("city", "San Francisco")}]
    return state

def competitor_agent(state: LocationState) -> LocationState:
    """3. Search nearby businesses."""
    print("--- Competitor Agent ---")
    state["competitors"] = [{"name": "Mock Competitor", "distance": 500}]
    return state

def accessibility_agent(state: LocationState) -> LocationState:
    """4. Analyze Roads, Parking, Public Transport, Walkability."""
    print("--- Accessibility Agent ---")
    state["accessibility_data"] = {"walkability": "High", "transit": "Excellent", "parking": "Limited"}
    return state

def population_agent(state: LocationState) -> LocationState:
    """5. Estimate customer density."""
    print("--- Population Agent ---")
    state["population_data"] = {"density": "High", "demographic_match": 85}
    return state

def traffic_agent(state: LocationState) -> LocationState:
    """6. Analyze accessibility and traffic patterns."""
    print("--- Traffic Agent ---")
    state["traffic_data"] = {"footfall": "15,000/day", "peak_hours": ["08:00", "17:00"]}
    return state

def rental_analysis_agent(state: LocationState) -> LocationState:
    """7. Estimate commercial rent."""
    print("--- Rental Analysis Agent ---")
    state["rental_data"] = {"estimated_rent": 5000, "affordability": "Moderate"}
    return state

def growth_agent(state: LocationState) -> LocationState:
    """8. Analyze future growth."""
    print("--- Growth Agent ---")
    state["growth_data"] = {"trend": "Upward", "new_developments": 2}
    return state

def risk_agent(state: LocationState) -> LocationState:
    """9. Analyze Competition, High Rent, Accessibility Challenges."""
    print("--- Risk Agent ---")
    state["risk_data"] = {"risk_level": "Medium", "factors": ["High Rent", "Moderate Competition"]}
    return state

def financial_agent(state: LocationState) -> LocationState:
    """10. Estimate Revenue, Expenses, ROI, Break-even."""
    print("--- Financial Agent ---")
    state["financial_data"] = {
        "revenue": 15000,
        "expenses": 8000,
        "roi_percentage": 150,
        "break_even_months": 8
    }
    return state

def recommendation_agent(state: LocationState) -> LocationState:
    """11. Generate final recommendation."""
    print("--- Recommendation Agent ---")
    state["final_score"] = 82.5
    state["recommendation"] = {
        "summary": "Strong candidate if budget supports rent.",
        "pros": ["High footfall", "Good transit"],
        "cons": ["High rent", "Parking is limited"]
    }
    return state

# ---------------------------------------------------------
# BUILD THE GRAPH
# ---------------------------------------------------------

def build_location_graph():
    workflow = StateGraph(LocationState)

    # Add Nodes
    workflow.add_node("business_analysis", business_analysis_agent)
    workflow.add_node("location_search", location_search_agent)
    workflow.add_node("competitor", competitor_agent)
    workflow.add_node("accessibility", accessibility_agent)
    workflow.add_node("population", population_agent)
    workflow.add_node("traffic", traffic_agent)
    workflow.add_node("rental", rental_analysis_agent)
    workflow.add_node("growth", growth_agent)
    workflow.add_node("risk", risk_agent)
    workflow.add_node("financial", financial_agent)
    workflow.add_node("recommendation", recommendation_agent)

    # Set Entry Point
    workflow.set_entry_point("business_analysis")

    # Define Edges (Sequential for now, can be parallelized)
    workflow.add_edge("business_analysis", "location_search")
    workflow.add_edge("location_search", "competitor")
    workflow.add_edge("competitor", "accessibility")
    workflow.add_edge("accessibility", "population")
    workflow.add_edge("population", "traffic")
    workflow.add_edge("traffic", "rental")
    workflow.add_edge("rental", "growth")
    workflow.add_edge("growth", "risk")
    workflow.add_edge("risk", "financial")
    workflow.add_edge("financial", "recommendation")
    workflow.add_edge("recommendation", END)

    return workflow.compile()

location_graph = build_location_graph()

def run_location_workflow(inputs: dict):
    # Ensure default dict structures exist
    state = {
        "business_type": inputs.get("business_type", ""),
        "target_customers": inputs.get("target_customers", ""),
        "budget": inputs.get("budget", ""),
        "city": inputs.get("city", ""),
        "radius": inputs.get("radius", 5),
        "candidate_locations": [],
        "competitors": [],
        "accessibility_data": {},
        "population_data": {},
        "traffic_data": {},
        "rental_data": {},
        "growth_data": {},
        "risk_data": {},
        "financial_data": {},
        "recommendation": {},
        "final_score": 0.0
    }
    
    result = location_graph.invoke(state)
    return result
