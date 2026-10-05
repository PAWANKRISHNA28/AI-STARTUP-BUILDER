from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_llm(temperature=0.7, require_structured_output=False, structured_schema=None):
    """
    Returns an LLM instance based on available API keys.
    Defaults to Gemini if both are present, otherwise uses whatever is available.
    """
    # Prefer Gemini if both keys are available
    if settings.GEMINI_API_KEY:
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.8-flash", # You can adjust this to gemini-1.5-flash as well
            api_key=settings.GEMINI_API_KEY,
            temperature=temperature
        )
    elif getattr(settings, 'OPENAI_API_KEY', None):
        llm = ChatOpenAI(
            model="gpt-4o",
            api_key=getattr(settings, 'OPENAI_API_KEY', None),
            temperature=temperature
        )
    else:
        return None  # Will fall back to mock mode in agents
        
    if require_structured_output and structured_schema:
        # LangChain supports with_structured_output on both ChatOpenAI and ChatGoogleGenerativeAI
        return llm.with_structured_output(structured_schema)
        
    return llm
