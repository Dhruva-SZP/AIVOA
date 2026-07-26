# AIVOA — AI-Powered Customer Complaint Management System

Pharmaceutical (API/FDF) manufacturing Customer Complaint module, built for the AIVOA Round 1 Full Stack Developer Assessment.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Redux Toolkit (Vite) |
| Backend | Python FastAPI |
| AI Agent Framework | LangGraph |
| LLM | Groq `gemma2-9b-it` (fallback `llama-3.3-70b-versatile`) |
| Database | PostgreSQL / MySQL (SQLAlchemy — SQLite by default for local demo) |
| Font | Google Inter |

## Why this design

A pharmaceutical Customer Complaint module under a QMS (ICH Q10 / 21 CFR 211.198) exists to: capture every customer-reported issue about a marketed API/FDF batch, decide how serious it is, check whether it's a duplicate/trend (recall signal), route it to an investigation, and drive CAPA. The AI Copilot mirrors that lifecycle as a 7-step LangGraph pipeline instead of one big prompt, so each step is auditable and independently correctable — the same way a human QA reviewer works through a complaint checklist.

## Project layout

```
backend/
  app/
    main.py            FastAPI app, CORS, router registration
    models.py           Complaint + AIAnalysis SQLAlchemy models
    schemas.py          Pydantic request/response schemas
    database.py         SQLAlchemy engine/session (Postgres/MySQL/SQLite)
    routers/
      complaints.py      CRUD for the Complaint Register
      ai.py              /api/ai/analyze/text and /analyze/upload
    ai/
      state.py           LangGraph shared state (TypedDict)
      prompts.py         QMS-grounded prompt templates per node
      groq_client.py     Groq call wrapper w/ JSON parsing + fallback model
      graph.py           StateGraph: extract -> completeness -> duplicate
                          -> risk -> root_cause -> capa -> summarize
    utils/file_parser.py PDF / .eml / .txt text extraction
  seed_data.py           Seeds 2 historical complaints (for duplicate demo)
  requirements.txt
  .env.example
frontend/
  src/
    store/               complaintsSlice, aiSlice (Redux Toolkit)
    api/client.js         Axios calls to the FastAPI backend
    components/           ComplaintIntake, LogComplaintForm, AICopilotPanel,
                           ComplaintsTable, Sidebar, TopBar
    App.jsx, index.css
sample_data/
  sample_complaint_email.eml     Upload demo (quality defect, discoloration)
  sample_complaint_text.txt      Paste-text demo (adverse event / taste complaint)
  sample_complaint_letter.pdf    Upload demo (packaging/labeling defect)
```

## End-to-end workflow (what to show in the demo video)

1. **Frontend input** — On the "Log Complaint" screen, paste text (or upload one of the `sample_data` files) in `ComplaintIntake.jsx` and click **Run AI Copilot**.
2. **API call** — `api/client.js` calls `POST /api/ai/analyze/text` or `/analyze/upload`; Redux thunk `runAnalyzeText`/`runAnalyzeUpload` in `aiSlice.js` tracks loading/success/error.
3. **Backend endpoint** — `routers/ai.py` extracts text (`utils/file_parser.py` for PDF/.eml), pulls the last 25 complaints from Postgres/MySQL as context, and calls `run_ai_copilot(...)`.
4. **LangGraph workflow** — `ai/graph.py` runs the compiled `StateGraph` node-by-node, each node calling Groq via `ai/groq_client.py` with the prompt from `ai/prompts.py`:
   - `extract` → structured fields (product, batch, customer, category, description...)
   - `completeness_check` → % complete + missing mandatory fields + clarifying questions
   - `duplicate_check` → compares against the DB sample of past complaints
   - `risk_classify` → Critical / Major / Minor + rationale
   - `root_cause` → Man/Machine/Material/Method/Environment hypotheses
   - `capa_recommend` → Corrective/Preventive actions + owning function
   - `summarize` → 2–3 sentence executive summary
5. **Response populates the UI** — the `AICopilotResult` JSON is dispatched via `populateFromAI` into `complaintsSlice`, which auto-fills `LogComplaintForm.jsx` (teal "AI-filled" highlight, still editable) and renders `AICopilotPanel.jsx` (risk strip, completeness bar, duplicates, root cause, CAPA, summary).
6. **Save** — clicking **Save Complaint** calls `POST /api/complaints` with the (possibly edited) form fields plus the AI result, persisting both a `Complaint` and its linked `AIAnalysis` row. It then appears in the **Complaint Register** table with its AI-assessed risk level.

## Running locally

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # add your real GROQ_API_KEY
python seed_data.py         # optional: seed 2 sample historical complaints
uvicorn app.main:app --reload --port 8000
```
- Default `DATABASE_URL` in `.env.example` is SQLite (`aivoa.db`) for a zero-setup demo.
- For Postgres/MySQL: set `DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/dbname` (or `mysql+pymysql://...`) — no code changes needed.
- Get a Groq API key at https://console.groq.com.

### Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

## Bonus AI features implemented

- Complaint Completeness Checker
- Duplicate Complaint Detection
- AI Risk Classification (Critical/Major/Minor)
- Root Cause Recommendation
- CAPA Recommendation
- Complaint Summary
