import os
from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from app.agents.llm_factory import get_llm
from app.core.config import settings
from app.services.rag.retriever import KnowledgeRetriever

class MasterAgent:
    def __init__(self):
        self.llm = get_llm(temperature=0.7)

    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        messages = state.get("messages", [])
        
        if not self.llm:
            state["messages"].append({"role": "assistant", "content": "I am operating in mock mode because no OPENAI_API_KEY was found in the environment variables. Please add one to use the real AI!"})
            return state
            
        latest_user_query = ""
        for msg in reversed(messages):
            if msg["role"] == "user":
                latest_user_query = msg["content"]
                break
                
        retrieved_context = ""
        if latest_user_query:
            try:
                chunks = KnowledgeRetriever.retrieve_context(latest_user_query, n_results=5)
                if chunks:
                    retrieved_context = "\n\nRelevant Knowledge Base Information:\n" + "\n---\n".join([c["text"] for c in chunks])
            except Exception as e:
                print("Error retrieving context:", e)

        system_prompt = (
            "You are the AI Startup Builder orchestrator. Your job is to help the user build their startup by answering questions, defining plans, and guiding them through market research. "
            "Never answer directly without considering the retrieved knowledge if available."
        ) + retrieved_context

        lc_messages: List[BaseMessage] = [
            SystemMessage(content=system_prompt)
        ]
        
        for msg in messages:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                from langchain_core.messages import AIMessage
                lc_messages.append(AIMessage(content=msg["content"]))
                
        response = await self.llm.ainvoke(lc_messages)
        
        state["messages"].append({"role": "assistant", "content": response.content})
        return state
