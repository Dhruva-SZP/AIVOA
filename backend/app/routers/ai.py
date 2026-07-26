from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..ai.graph import run_ai_copilot
from ..utils.file_parser import extract_text

router = APIRouter(prefix="/api/ai", tags=["ai-copilot"])


def _existing_complaints_brief(db: Session):
    """Small summary of past complaints fed to the duplicate-detection node -
    keep it light so we don't blow the LLM context on large complaint logs."""
    rows = (
        db.query(models.Complaint)
        .order_by(models.Complaint.created_at.desc())
        .limit(25)
        .all()
    )
    return [
        {
            "complaint_number": c.complaint_number,
            "product_name": c.product_name,
            "batch_number": c.batch_number,
            "description": c.description,
        }
        for c in rows
    ]


def _run_and_shape(raw_text: str, source_type: str, db: Session) -> schemas.AICopilotResult:
    if not raw_text or not raw_text.strip():
        raise HTTPException(status_code=400, detail="No text could be extracted from the input.")

    existing = _existing_complaints_brief(db)
    final_state = run_ai_copilot(raw_text, source_type, existing)

    return schemas.AICopilotResult(
        extracted=schemas.ExtractedFields(**final_state.get("extracted", {})),
        completeness_score=final_state.get("completeness_score", 0),
        missing_fields=final_state.get("missing_fields", []),
        clarifying_questions=final_state.get("clarifying_questions", []),
        risk_level=final_state.get("risk_level", "Major"),
        risk_rationale=final_state.get("risk_rationale", ""),
        duplicate_matches=final_state.get("duplicate_matches", []),
        root_cause_suggestions=final_state.get("root_cause_suggestions", []),
        capa_suggestions=final_state.get("capa_suggestions", []),
        summary=final_state.get("summary", ""),
    )


@router.post("/analyze/text", response_model=schemas.AICopilotResult)
def analyze_text(payload: schemas.AnalyzeTextRequest, db: Session = Depends(get_db)):
    """Run the AI Copilot LangGraph workflow on pasted complaint text."""
    return _run_and_shape(payload.raw_text, payload.source_type, db)


@router.post("/analyze/upload", response_model=schemas.AICopilotResult)
def analyze_upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Run the AI Copilot LangGraph workflow on an uploaded PDF/.eml/.txt file."""
    file_bytes = file.file.read()
    raw_text = extract_text(file.filename, file_bytes)
    source_type = "pdf" if file.filename.lower().endswith(".pdf") else (
        "email" if file.filename.lower().endswith(".eml") else "text"
    )
    return _run_and_shape(raw_text, source_type, db)
