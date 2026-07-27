<div align="center">

# 💊 AIVOA — AI Copilot for Pharma Complaint Management

**Paste a customer complaint. Get a risk-assessed, investigation-ready QMS record in seconds.**

Built for the **AIVOA Round 1 Full Stack Developer Assessment** — an AI-powered complaint intake system that transforms raw customer complaints into structured, investigation-ready QMS records using a multi-step LangGraph workflow.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://aivoa-henna.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Docs-blue?style=for-the-badge)](https://aivoa-rb96.onrender.com/docs)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge)](https://aivoa-rb96.onrender.com/api/health)

</div>

---

# 📖 Overview

Pharmaceutical companies receive numerous customer complaints related to product quality, packaging, labeling, contamination, and adverse events. Before a complaint can be investigated, QA teams must manually extract information, determine complaint completeness, assess severity, search historical complaints, recommend CAPA actions, and document everything in the Quality Management System (QMS).

**AIVOA automates this complaint intake process using AI.**

Instead of spending several minutes manually processing every complaint, QA teams can simply upload a complaint document or paste the complaint text. The AI analyzes the complaint through a structured multi-step workflow and generates a complete draft complaint record within seconds.

The AI **assists** quality reviewers—it does **not replace** them. Every generated field remains editable before final approval.

---

# ✨ Features

- 📄 Upload complaint files (.pdf, .txt, .eml)
- ✍️ Paste complaint text
- 🤖 AI-powered complaint analysis
- 🔍 Automatic information extraction
- ✅ Complaint completeness checker
- 🔁 Duplicate complaint detection
- 🚦 AI Risk Classification
- 🧩 Root Cause Analysis
- 🛠️ CAPA Recommendations
- 📝 Executive Summary generation
- 📋 Editable complaint form
- 📚 Complaint Register
- 📊 AI Risk Assessment Dashboard

---

# 🧠 AI Workflow

```text
Complaint Input
        │
        ▼
Information Extraction
        │
        ▼
Complaint Completeness Check
        │
        ▼
Duplicate Complaint Detection
        │
        ▼
Risk Classification
        │
        ▼
Root Cause Analysis
        │
        ▼
CAPA Recommendation
        │
        ▼
Executive Summary
        │
        ▼
Human Review
        │
        ▼
Complaint Register
```

---

# 🏗️ Architecture

```text
frontend (React + Redux Toolkit)
        │
        ▼
POST /api/ai/analyze/text
POST /api/ai/analyze/upload
        │
        ▼
FastAPI Backend
        │
        ▼
LangGraph Workflow
        │
        ├── Extract Information
        ├── Completeness Check
        ├── Duplicate Detection
        ├── Risk Classification
        ├── Root Cause Analysis
        ├── CAPA Recommendation
        └── Summary Generation
        │
        ▼
Groq LLM
(gemma2-9b-it)
        │
        ▼
Structured AI Response
        │
        ▼
Editable Complaint Form
        │
        ▼
PostgreSQL Database
        │
        ▼
Complaint Register
```

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Redux Toolkit + Vite |
| Backend | FastAPI |
| AI Workflow | LangGraph |
| LLM | Groq (`gemma2-9b-it`) |
| ORM | SQLAlchemy |
| Database | PostgreSQL (SQLite supported locally) |
| File Parsing | PyPDF, Email Parser |
| Deployment | Vercel + Render |
| Styling | CSS |

---

# 🌐 Live Demo

### 🚀 Frontend

https://aivoa-henna.vercel.app

### ⚙️ Backend

https://aivoa-rb96.onrender.com/api/health

### 📚 API Documentation

https://aivoa-rb96.onrender.com/docs

> **Note:** The backend is hosted on Render's free tier. The first request after inactivity may take 30–50 seconds while the service wakes up.

---

# 📂 Project Structure

```text
AIVOA
│
├── backend
│   ├── app
│   │   ├── ai
│   │   ├── database
│   │   ├── models
│   │   ├── routers
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   │
│   ├── requirements.txt
│   └── seed_data.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
├── sample_data
│
└── README.md
```

---

# 🚀 Running Locally

## Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env

# Add your GROQ_API_KEY

python seed_data.py

uvicorn app.main:app --reload --port 8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🤖 AI Features Implemented

- ✅ Complaint Extraction
- ✅ Complaint Completeness Checker
- ✅ Duplicate Complaint Detection
- ✅ AI Risk Classification
- ✅ Root Cause Recommendation
- ✅ CAPA Recommendation
- ✅ AI Summary Generation

---

# 💡 Why LangGraph?

Instead of asking the LLM to perform every task in a single prompt, AIVOA models the pharmaceutical complaint review workflow as a sequence of specialized AI agents.

Each stage focuses on one responsibility:

- Information Extraction
- Completeness Validation
- Duplicate Detection
- Risk Assessment
- Root Cause Analysis
- CAPA Recommendation
- Executive Summary

This modular approach makes the system:

- More transparent
- Easier to debug
- Easier to improve
- Better aligned with real pharmaceutical Quality Management workflows

---

# 🎯 Future Improvements

- OCR support for scanned complaint PDFs
- Image-based defect analysis
- SAP/QMS integration
- Multi-language complaint processing
- Email inbox integration
- Analytics dashboard
- AI confidence scoring
- Role-based authentication

---

# 👨‍💻 Developer

**Dhruva N**

Computer Science & Business Systems

Malnad College of Engineering

GitHub:
https://github.com/Dhruva-SZP

LinkedIn:
https://www.linkedin.com/in/dhruva-n/

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a Star!

**Built with ❤️ using React, FastAPI, LangGraph & Groq AI**

</div>