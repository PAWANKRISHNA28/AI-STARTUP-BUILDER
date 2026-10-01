# AI STARTUP BUILDER

## DESCRIPTION
AI STARTUP BUILDER is an enterprise-grade Multi-Agent AI SaaS platform that converts simple startup ideas into complete, investor-ready startup blueprints. The platform coordinates 24 specialized AI agents using a LangGraph Orchestrator to generate comprehensive business, technical, marketing, financial, design, architectural, and pitch deck artifacts.

## TECH STACK

**FRONTEND:**
- Framework: React 18 + TypeScript + Vite
- State Management: Zustand
- Styling: Tailwind CSS, Framer Motion
- UI Components: Lucide Icons, Recharts (Data Visualization)
- Mapping: Mapbox GL (via react-map-gl)
- 3D Rendering: Three.js (via react-three-fiber)

**BACKEND:**
- Framework: FastAPI (Async Python 3.10+)
- Database: Async SQLAlchemy + SQLite (default out-of-the-box zero-config execution)
- AI/Services: LangChain, LangGraph StateGraph, OpenAI, Cloudinary, Stripe, Twilio
- Security: JWT Bearer Tokens + PBKDF2/SHA256 Password Hashing

## REQUIREMENTS
- Python 3.10+
- Node.js 18+
- npm 9+

## INSTALLATION & SETUP

### ENVIRONMENT VARIABLES
Copy `.env.example` in the root folder to create `.env` configurations as needed. For local development, the default settings require no API keys, as the AI and third-party services include fallback mock responses when keys are missing.

To enable real AI, set `OPENAI_API_KEY` in `backend/.env`.

### DATABASE SETUP
The project uses SQLite by default for zero-configuration setup. The database `ai_startup_builder.db` will be created automatically in the root folder upon the first backend request.

### BACKEND SETUP
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### FRONTEND SETUP
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## HOW TO RUN

**Start the Backend:**
From the `backend` directory, run:
```bash
python -m uvicorn app.main:app --reload
```
*The FastAPI server will launch on `http://127.0.0.1:8000`.*

**Start the Frontend:**
From the `frontend` directory, run:
```bash
npm run dev
```
*The React application will launch on `http://localhost:3000`.*

## TEST LOGIN / DEMO INFORMATION
You can create your own account safely by clicking the "Get Started" or "Sign Up" button. Since the local application uses an isolated SQLite database, any email and password you provide during registration will be used safely to manage your own local session.

## API DOCUMENTATION
With the backend running, the interactive Swagger UI documentation is automatically generated and accessible at:
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

## KNOWN LIMITATIONS
- **Mock Fallbacks:** If API keys for services like OpenAI, Resend, or Twilio are missing from the `backend/.env`, the system gracefully falls back to returning safe mock data (e.g., printing emails to the console instead of sending them).
