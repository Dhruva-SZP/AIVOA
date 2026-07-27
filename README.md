# <div align="center">

# 

# \# 💊 AIVOA — AI Copilot for Pharma Complaint Management

# 

# \*\*Paste a customer complaint. Get a risk-assessed, investigation-ready QMS record in seconds.\*\*

# 

# Built for the AIVOA Round 1 Full Stack Developer Assessment — an AI agent pipeline that reads raw complaint emails/PDFs the way a QA reviewer would, and turns them into structured, risk-classified records ready for CAPA.

# 

# \[\*\*🚀 Live App\*\*](https://aivoa-henna.vercel.app) · \[\*\*📡 API Docs\*\*](https://aivoa-rb96.onrender.com/docs) · \[\*\*🎥 Demo Video\*\*](#)

# 

# </div>

# 

# \---

# 

# \## The problem

# 

# Every customer complaint in a pharmaceutical API/FDF plant has to be logged, checked for completeness, cross-referenced against past complaints, risk-classified, and routed toward a root-cause investigation and CAPA — all before a QA reviewer can even start the real work. That intake step is repetitive, slow, and easy to get wrong under deadline pressure.

# 

# \*\*AIVOA automates the intake step\*\*, not the QA judgment. A reviewer still reviews and approves everything — the AI just does the first pass in seconds instead of minutes.

# 

# \## What it does

# 

# Drop in a complaint (pasted email text or an uploaded PDF/.eml), and a 7-step \*\*LangGraph\*\* agent pipeline — running on \*\*Groq's `gemma2-9b-it`\*\* — walks it through:

# 

# ```

# &#x20;extract → completeness check → duplicate detection → risk classification

# &#x20;       → root cause hypotheses → CAPA recommendations → summary

# ```

# 

# | Step | What it answers |

# |---|---|

# | 🔍 \*\*Extract\*\* | Who, what product, which batch, what happened? |

# | ✅ \*\*Completeness\*\* | Is there enough here to open an investigation? |

# | 🔁 \*\*Duplicate detection\*\* | Has this been reported before — is it a trend? |

# | 🚦 \*\*Risk classification\*\* | Critical / Major / Minor — and why |

# | 🧩 \*\*Root cause\*\* | Man / Machine / Material / Method / Environment hypotheses |

# | 🛠️ \*\*CAPA\*\* | Concrete corrective + preventive actions, by owning function |

# | 📝 \*\*Summary\*\* | A 2–3 sentence brief for the QA manager's dashboard |

# 

# The results populate an editable \*\*Log Customer Complaint\*\* form and an \*\*AI Copilot Risk Assessment\*\* panel side by side — nothing gets saved to the register without a human reviewing it first.

# 

# \## See it live

# 

# | | |

# |---|---|

# | 🖥️ Frontend | https://aivoa-henna.vercel.app |

# | ⚙️ Backend API | https://aivoa-rb96.onrender.com/api/health |

# | 📘 Interactive API docs | https://aivoa-rb96.onrender.com/docs |

# 

# > ⏳ The backend is on Render's free tier, so it spins down after inactivity — the first request after idle time can take 30–50s to wake up.

# 

# Sample complaints to try are in \[`sample\_data/`](./sample\_data) — an email with a quality defect, a call transcript with a possible adverse event, and a PDF with a packaging/labeling issue.

# 

# \## Tech stack

# 

# | Layer | Tech |

# |---|---|

# | Frontend | React + Redux Toolkit (Vite) |

# | Backend | FastAPI |

# | AI orchestration | LangGraph |

# | LLM | Groq — `gemma2-9b-it` (fallback: `llama-3.3-70b-versatile`) |

# | Database | PostgreSQL (SQLAlchemy — MySQL/SQLite also supported) |

# | Hosting | Vercel (frontend) · Render (backend + Postgres) |

# | Font | Google Inter |

# 

# \## Architecture

# 

# ```

# frontend/  React + Redux Toolkit

# &#x20; │  paste / upload complaint

# &#x20; ▼

# backend/app/routers/ai.py     POST /api/ai/analyze/text | /analyze/upload

# &#x20; │  extracts text (PDF/.eml/.txt), pulls recent complaints for context

# &#x20; ▼

# backend/app/ai/graph.py       LangGraph StateGraph (7 nodes, see table above)

# &#x20; │  each node → backend/app/ai/groq\_client.py → Groq API

# &#x20; ▼

# AICopilotResult JSON  →  auto-fills LogComplaintForm.jsx (editable)

# &#x20;                     →  renders AICopilotPanel.jsx

# &#x20; │  reviewer edits / approves

# &#x20; ▼

# POST /api/complaints  →  Complaint + AIAnalysis saved to Postgres

# &#x20;                     →  appears in Complaint Register

# ```

# 

# Full file-by-file breakdown is in \[`backend/`](./backend) and \[`frontend/`](./frontend).

# 

# \## Running it locally

# 

# <details>

# <summary><b>Backend</b></summary>

# 

# ```bash

# cd backend

# python -m venv venv \&\& source venv/bin/activate   # Windows: venv\\Scripts\\activate

# pip install -r requirements.txt

# cp .env.example .env        # add your GROQ\_API\_KEY — get one free at console.groq.com

# python seed\_data.py         # optional: seeds 2 sample complaints for duplicate detection

# uvicorn app.main:app --reload --port 8000

# ```

# Defaults to a local SQLite file — zero setup. Point `DATABASE\_URL` at Postgres/MySQL to match production, no code changes needed.

# </details>

# 

# <details>

# <summary><b>Frontend</b></summary>

# 

# ```bash

# cd frontend

# npm install

# npm run dev      # http://localhost:5173

# ```

# </details>

# 

# \## Bonus AI features implemented

# 

# \- ✅ Complaint Completeness Checker

# \- ✅ Duplicate Complaint Detection

# \- ✅ AI Risk Classification (Critical / Major / Minor)

# \- ✅ Root Cause Recommendation

# \- ✅ CAPA Recommendation

# \- ✅ Complaint Summary

# 

# \## Why LangGraph instead of one big prompt?

# 

# A QA reviewer doesn't assess a complaint in one mental step — they check completeness, then risk, then precedent, then root cause, in sequence, each informed by the last. Modeling that as a \*\*graph of small, auditable steps\*\* rather than one large prompt means each stage can be inspected, corrected, or re-run independently — closer to how the actual QMS process works, and much easier to debug and explain than a black-box single call.

# 

# \---

# 

# <div align="center">

# 

# Built by \[Dhruva-SZP](https://github.com/Dhruva-SZP) for the AIVOA Round 1 Full Stack Developer Assessment

# 

# </div>

