from typing import TypedDict, List, Dict, Any, Optional


class ComplaintState(TypedDict, total=False):
    # --- input ---
    raw_text: str
    source_type: str
    existing_complaints: List[Dict[str, Any]]  # lightweight list for duplicate check

    # --- populated by nodes, in order ---
    extracted: Dict[str, Any]

    completeness_score: float
    missing_fields: List[str]
    clarifying_questions: List[str]

    duplicate_matches: List[Dict[str, Any]]

    risk_level: str
    risk_rationale: str

    root_cause_suggestions: List[Dict[str, Any]]
    capa_suggestions: List[Dict[str, Any]]

    summary: str

    errors: List[str]
