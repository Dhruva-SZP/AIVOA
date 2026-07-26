import datetime as dt
import uuid

from sqlalchemy import Column, String, Text, DateTime, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class Complaint(Base):
    """
    Mirrors the fields a QA reviewer fills in on the 'Log Customer Complaint'
    form. Most of these get pre-populated by the AI extraction step and can
    then be reviewed/edited by the user before saving.
    """

    __tablename__ = "complaints"

    id = Column(String(36), primary_key=True, default=gen_id)
    complaint_number = Column(String(32), unique=True, index=True)

    # --- Source ---
    source_type = Column(String(20), default="manual")  # manual | pdf | email | text
    source_filename = Column(String(255), nullable=True)
    raw_text = Column(Text, nullable=True)

    # --- Core QMS complaint fields ---
    customer_name = Column(String(255), nullable=True)
    customer_email = Column(String(255), nullable=True)
    product_name = Column(String(255), nullable=True)
    batch_number = Column(String(100), nullable=True)
    market_country = Column(String(100), nullable=True)
    quantity_affected = Column(String(100), nullable=True)
    complaint_category = Column(String(100), nullable=True)  # e.g. Quality, Packaging, Efficacy, Adverse Event
    date_of_occurrence = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)

    status = Column(String(30), default="Open")  # Open | Under Investigation | Closed
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)

    ai_analysis = relationship(
        "AIAnalysis", back_populates="complaint", uselist=False, cascade="all, delete-orphan"
    )


class AIAnalysis(Base):
    """
    Stores the output of the LangGraph AI Copilot run for a given complaint:
    completeness check, risk classification, duplicate matches, root cause
    suggestions, CAPA recommendations and the generated summary.
    """

    __tablename__ = "ai_analyses"

    id = Column(String(36), primary_key=True, default=gen_id)
    complaint_id = Column(String(36), ForeignKey("complaints.id"), unique=True)

    completeness_score = Column(Float, nullable=True)
    missing_fields = Column(JSON, nullable=True)
    clarifying_questions = Column(JSON, nullable=True)

    risk_level = Column(String(20), nullable=True)  # Critical | Major | Minor
    risk_rationale = Column(Text, nullable=True)

    duplicate_matches = Column(JSON, nullable=True)

    root_cause_suggestions = Column(JSON, nullable=True)
    capa_suggestions = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)

    raw_state = Column(JSON, nullable=True)  # full LangGraph end-state, for debugging/demo
    created_at = Column(DateTime, default=dt.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="ai_analysis")
