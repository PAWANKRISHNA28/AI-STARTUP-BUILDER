from typing import Dict, Any, List

class PlannerAgent:
    def __init__(self):
        pass

    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print("Planner Agent generating plan...")
        state["plan"] = "1. Research Market\n2. Analyze Competitors\n3. Define Business Model"
        return state
