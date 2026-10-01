import sys
import os
import traceback

def run_test():
    try:
        from app.core.config import settings
        print("SETTINGS: PASS")
    except Exception as e:
        print("SETTINGS: FAIL")
        print(f"ROOT ERROR: {e}")
        return

    has_key = bool(settings.GEMINI_API_KEY)
    if has_key:
        print("GEMINI API KEY CONFIGURED: YES")
    else:
        print("GEMINI API KEY CONFIGURED: NO")
        print("ROOT ERROR: Missing GEMINI_API_KEY")
        print("FILE: app/core/config.py")
        print("LINE: 21")
        print("CAUSE: Environment variable not set or loaded")
        print("RECOMMENDED FIX: Check .env file and ensure GEMINI_API_KEY is present")
        return

    try:
        from app.ai.agents.llm_factory import get_llm
        llm = get_llm()
        if llm:
            print("GEMINI CLIENT: INITIALIZED")
            model_name = getattr(llm, "model", "Unknown")
            print(f"GEMINI MODEL: {model_name}")
            print("AGENT GEMINI INITIALIZATION: PASS")
        else:
            print("GEMINI CLIENT: NOT INITIALIZED")
            print("AGENT GEMINI INITIALIZATION: FAIL")
            print("ROOT ERROR: get_llm returned None")
            print("FILE: app/ai/agents/llm_factory.py")
            print("LINE: 24")
            print("CAUSE: get_llm failed to initialize ChatGoogleGenerativeAI despite having key")
            print("RECOMMENDED FIX: Check get_llm logic")
            return
    except Exception as e:
        print("GEMINI CLIENT: NOT INITIALIZED")
        print("AGENT GEMINI INITIALIZATION: FAIL")
        print(f"ROOT ERROR: {e}")
        print("FILE: app/ai/agents/llm_factory.py")
        print("LINE: 12")
        print("CAUSE: Exception during initialization")
        print("RECOMMENDED FIX: Check langchain-google-genai installation and dependencies")
        traceback.print_exc()
        return

    try:
        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content="Say 'PASS' if you hear this.")])
        if response and response.content:
            print("MINIMAL GENERATION TEST: PASS")
        else:
            print("MINIMAL GENERATION TEST: FAIL")
            print("ROOT ERROR: Empty response")
    except Exception as e:
        print("MINIMAL GENERATION TEST: FAIL")
        print(f"ROOT ERROR: {e}")
        print("FILE: app/ai/agents/llm_factory.py")
        print("LINE: 12")
        print("CAUSE: Exception during invoke")
        print("RECOMMENDED FIX: Verify API key validity and internet connection")
        traceback.print_exc()

if __name__ == "__main__":
    # Add the current directory to sys.path to resolve 'app'
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    run_test()
