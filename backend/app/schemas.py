from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ExtractedFields(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    market_country: Optional[str] = None
    quantity_affected: Optional[str] = None
    complaint_category: Optional[str] = None
    date_of_occurrence: Optional[str] = None
    description: Optional[str] = None


class AICopilotResult(BaseModel):
    extracted: ExtractedFields
    completeness_score: float
    missing_fields: List[str]
    clarifying_questions: List[str]
    risk_level: str
    risk_rationale: str
    duplicate_matches: List[Dict[str, Any]]
    root_cause_suggestions: List[Dict[str, Any]]
    capa_suggestions: List[Dict[str, Any]]
    summary: str


class AnalyzeTextRequest(BaseModel):
    raw_text: str
    source_type: str = "text"


class ComplaintCreate(BaseModel):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    market_country: Optional[str] = None
    quantity_affected: Optional[str] = None
    complaint_category: Optional[str] = None
    date_of_occurrence: Optional[str] = None
    description: Optional[str] = None
    source_type: str = "manual"
    source_filename: Optional[str] = None
    raw_text: Optional[str] = None
    ai_result: Optional[AICopilotResult] = None


class ComplaintOut(BaseModel):
    id: str
    complaint_number: Optional[str]
    customer_name: Optional[str]
    customer_email: Optional[str]
    product_name: Optional[str]
    batch_number: Optional[str]
    market_country: Optional[str]
    quantity_affected: Optional[str]
    complaint_category: Optional[str]
    date_of_occurrence: Optional[str]
    description: Optional[str]
    status: str
    source_type: str
    risk_level: Optional[str] = None

    class Config:
        from_attributes = True
