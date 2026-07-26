"""
The AI Copilot workflow, built as a LangGraph StateGraph.

Pipeline:
  extract -> completeness_check -> duplicate_check -> risk_classify
           -> root_cause -> capa_recommend -> summarize -> END

Every node reads/writes the shared ComplaintState and calls Groq
(gemma2-9b-it, falling back to llama-3.3-70b-versatile) through
groq_client.call_json for structured JSON output.
"""
import json
from langgraph.graph import StateGraph, END

from .state import ComplaintState
from .groq_client import call_json
from . import prompts

MANDATORY_FIELDS = [
    "product_name",
    "batch_number",
    "customer_name",
    "complaint_category",
    "date_of_occurrence",
    "description",
]


def node_extract(state: ComplaintState) -> ComplaintState:
    result = call_json(prompts.EXTRACTION_SYSTEM, state["raw_text"])
    state["extracted"] = result or {}
    return state


def node_completeness(state: ComplaintState) -> ComplaintState:
    result = call_json(
        prompts.COMPLETENESS_SYSTEM, json.dumps(state.get("extracted", {}))
    )
    if not result:
        extracted = state.get("extracted", {})
        missing = [f for f in MANDATORY_FIELDS if not extracted.get(f)]
        result = {
            "completeness_score": round(100 * (1 - len(missing) / len(MANDATORY_FIELDS))),
            "missing_fields": missing,
            "clarifying_questions": [f"Please provide {f.replace('_', ' ')}." for f in missing],
        }
    state["completeness_score"] = result.get("completeness_score", 0)
    state["missing_fields"] = result.get("missing_fields", [])
    state["clarifying_questions"] = result.get("clarifying_questions", [])
    return state


def node_duplicate(state: ComplaintState) -> ComplaintState:
    existing = state.get("existing_complaints", [])
    if not existing:
        state["duplicate_matches"] = []
        return state
    payload = json.dumps(
        {"new_complaint": state.get("extracted", {}), "previous_complaints": existing}
    )
    result = call_json(prompts.DUPLICATE_SYSTEM, payload)
    state["duplicate_matches"] = result.get("duplicate_matches", []) if result else []
    return state


def node_risk(state: ComplaintState) -> ComplaintState:
    result = call_json(prompts.RISK_SYSTEM, json.dumps(state.get("extracted", {})))
    state["risk_level"] = (result or {}).get("risk_level", "Major")
    state["risk_rationale"] = (result or {}).get(
        "risk_rationale", "Default classification - AI response unavailable."
    )
    return state


def node_root_cause(state: ComplaintState) -> ComplaintState:
    result = call_json(prompts.ROOT_CAUSE_SYSTEM, json.dumps(state.get("extracted", {})))
    state["root_cause_suggestions"] = (result or {}).get("root_cause_suggestions", [])
    return state


def node_capa(state: ComplaintState) -> ComplaintState:
    payload = json.dumps(
        {
            "extracted": state.get("extracted", {}),
            "risk_level": state.get("risk_level"),
            "root_cause_suggestions": state.get("root_cause_suggestions", []),
        }
    )
    result = call_json(prompts.CAPA_SYSTEM, payload)
    state["capa_suggestions"] = (result or {}).get("capa_suggestions", [])
    return state


def node_summary(state: ComplaintState) -> ComplaintState:
    payload = json.dumps(
        {"extracted": state.get("extracted", {}), "risk_level": state.get("risk_level")}
    )
    result = call_json(prompts.SUMMARY_SYSTEM, payload)
    state["summary"] = (result or {}).get(
        "summary", state.get("extracted", {}).get("description", "")
    )
    return state


def build_graph():
    graph = StateGraph(ComplaintState)
    graph.add_node("extract", node_extract)
    graph.add_node("completeness_check", node_completeness)
    graph.add_node("duplicate_check", node_duplicate)
    graph.add_node("risk_classify", node_risk)
    graph.add_node("root_cause", node_root_cause)
    graph.add_node("capa_recommend", node_capa)
    graph.add_node("summarize", node_summary)

    graph.set_entry_point("extract")
    graph.add_edge("extract", "completeness_check")
    graph.add_edge("completeness_check", "duplicate_check")
    graph.add_edge("duplicate_check", "risk_classify")
    graph.add_edge("risk_classify", "root_cause")
    graph.add_edge("root_cause", "capa_recommend")
    graph.add_edge("capa_recommend", "summarize")
    graph.add_edge("summarize", END)

    return graph.compile()


# Compiled once at import time and reused across requests.
complaint_ai_graph = build_graph()


def run_ai_copilot(raw_text: str, source_type: str, existing_complaints: list) -> ComplaintState:
    initial_state: ComplaintState = {
        "raw_text": raw_text,
        "source_type": source_type,
        "existing_complaints": existing_complaints,
    }
    final_state = complaint_ai_graph.invoke(initial_state)
    return final_state
