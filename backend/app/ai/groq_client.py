"""
Thin wrapper around langchain_groq.ChatGroq so every LangGraph node calls the
LLM the same way, with a JSON-parsing helper (gemma2-9b-it is small and
occasionally wraps JSON in prose / markdown fences, so we defensively strip
and retry with the larger llama-3.3-70b-versatile model on parse failure).
"""
import json
import re
from typing import Any, Dict

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq

from ..config import settings

_primary = ChatGroq(
    model=settings.groq_model,
    api_key=settings.groq_api_key,
    temperature=0.2,
)

_fallback = ChatGroq(
    model=settings.groq_model_fallback,
    api_key=settings.groq_api_key,
    temperature=0.2,
)


def _strip_to_json(text: str) -> str:
    text = text.strip()
    # strip ```json ... ``` fences if the model added them
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    # grab the outermost {...} or [...] block as a last resort
    match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
    if match:
        text = match.group(1)
    return text


def call_json(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """Call Groq and parse the reply as JSON, retrying once on the fallback
    model if gemma2-9b-it returns something unparsable."""
    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]

    for llm in (_primary, _fallback):
        try:
            response = llm.invoke(messages)
            cleaned = _strip_to_json(response.content)
            return json.loads(cleaned)
        except Exception:
            continue

    # Both models failed to produce parseable JSON - return a safe empty dict
    # rather than crashing the whole LangGraph run.
    return {}
