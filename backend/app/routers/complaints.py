import datetime as dt
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/complaints", tags=["complaints"])


def _next_complaint_number(db: Session) -> str:
    year = dt.datetime.utcnow().year
    count = db.query(models.Complaint).count() + 1
    return f"CC-{year}-{count:04d}"


@router.get("", response_model=List[schemas.ComplaintOut])
def list_complaints(db: Session = Depends(get_db)):
    rows = db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).all()
    out = []
    for c in rows:
        item = schemas.ComplaintOut.model_validate(c)
        item.risk_level = c.ai_analysis.risk_level if c.ai_analysis else None
        out.append(item)
    return out


@router.get("/{complaint_id}")
def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    analysis = complaint.ai_analysis
    return {
        "complaint": schemas.ComplaintOut.model_validate(complaint),
        "ai_analysis": {
            "completeness_score": analysis.completeness_score,
            "missing_fields": analysis.missing_fields,
            "clarifying_questions": analysis.clarifying_questions,
            "risk_level": analysis.risk_level,
            "risk_rationale": analysis.risk_rationale,
            "duplicate_matches": analysis.duplicate_matches,
            "root_cause_suggestions": analysis.root_cause_suggestions,
            "capa_suggestions": analysis.capa_suggestions,
            "summary": analysis.summary,
        }
        if analysis
        else None,
    }


@router.post("", response_model=schemas.ComplaintOut)
def create_complaint(payload: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    """
    Saves a complaint after the user reviews/edits the AI-populated
    'Log Customer Complaint' form. If ai_result was supplied (i.e. the AI
    Copilot ran on this submission), it's persisted alongside the complaint.
    """
    complaint = models.Complaint(
        complaint_number=_next_complaint_number(db),
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        product_name=payload.product_name,
        batch_number=payload.batch_number,
        market_country=payload.market_country,
        quantity_affected=payload.quantity_affected,
        complaint_category=payload.complaint_category,
        date_of_occurrence=payload.date_of_occurrence,
        description=payload.description,
        source_type=payload.source_type,
        source_filename=payload.source_filename,
        raw_text=payload.raw_text,
    )
    db.add(complaint)
    db.flush()

    if payload.ai_result:
        r = payload.ai_result
        analysis = models.AIAnalysis(
            complaint_id=complaint.id,
            completeness_score=r.completeness_score,
            missing_fields=r.missing_fields,
            clarifying_questions=r.clarifying_questions,
            risk_level=r.risk_level,
            risk_rationale=r.risk_rationale,
            duplicate_matches=r.duplicate_matches,
            root_cause_suggestions=r.root_cause_suggestions,
            capa_suggestions=r.capa_suggestions,
            summary=r.summary,
            raw_state=r.model_dump(),
        )
        db.add(analysis)

    db.commit()
    db.refresh(complaint)
    out = schemas.ComplaintOut.model_validate(complaint)
    out.risk_level = payload.ai_result.risk_level if payload.ai_result else None
    return out


@router.patch("/{complaint_id}/status")
def update_status(complaint_id: str, status: str, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    complaint.status = status
    db.commit()
    return {"ok": True, "status": complaint.status}
