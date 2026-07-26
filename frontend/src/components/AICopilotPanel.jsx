import React from "react";
import { useSelector } from "react-redux";

const riskClass = (level) => {
  if (level === "Critical") return "risk-critical";
  if (level === "Minor") return "risk-minor";
  return "risk-major";
};

export default function AICopilotPanel() {
  const status = useSelector((s) => s.ai.status);
  const result = useSelector((s) => s.ai.result);

  if (status === "idle" || !result) {
    return (
      <div className="card">
        <h2>
          <span className="dot" /> AI Copilot Risk Assessment
        </h2>
        <div className="copilot-empty">
          Paste a complaint or upload a file, then run the AI Copilot to see the
          completeness check, risk classification, duplicate detection, root cause
          and CAPA recommendations here.
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="card">
        <h2>
          <span className="dot" /> AI Copilot Risk Assessment
        </h2>
        <div className="copilot-empty">
          <span className="spinner" style={{ borderTopColor: "var(--teal)", borderColor: "#ccc" }} />
          LangGraph workflow running: extract → completeness → duplicate check → risk
          → root cause → CAPA → summary...
        </div>
      </div>
    );
  }

  const {
    completeness_score,
    missing_fields = [],
    clarifying_questions = [],
    risk_level,
    risk_rationale,
    duplicate_matches = [],
    root_cause_suggestions = [],
    capa_suggestions = [],
    summary,
  } = result;

  return (
    <div className="card">
      <h2>
        <span className="dot" /> AI Copilot Risk Assessment
      </h2>

      <div className={`risk-strip ${riskClass(risk_level)}`}>
        <div className="tab-color" />
        <div className="tab-body">
          <span className="risk-badge">{risk_level} Risk</span>
          <div style={{ fontSize: 13, marginTop: 6 }}>{risk_rationale}</div>
        </div>
      </div>

      <div className="copilot-section">
        <h3>Completeness Checker</h3>
        <div className="completeness-bar">
          <div className="fill" style={{ width: `${completeness_score}%` }} />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 6 }}>
          {completeness_score}% complete
        </div>
        {missing_fields.length > 0 && (
          <div>
            {missing_fields.map((f) => (
              <span key={f} className="pill">
                Missing: {f.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
        {clarifying_questions.length > 0 && (
          <ul style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8, paddingLeft: 18 }}>
            {clarifying_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="copilot-section">
        <h3>Duplicate Complaint Detection</h3>
        {duplicate_matches.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
            No similar complaints found in the register.
          </div>
        ) : (
          duplicate_matches.map((d, i) => (
            <div className="dup-card" key={i}>
              <strong>{d.complaint_number}</strong> — {d.similarity} similarity
              <div>{d.reason}</div>
            </div>
          ))
        )}
      </div>

      <div className="copilot-section">
        <h3>Root Cause Recommendation</h3>
        {root_cause_suggestions.map((r, i) => (
          <div className="suggestion-card" key={i}>
            <div className="meta">
              {r.category} · {r.confidence} confidence
            </div>
            {r.hypothesis}
          </div>
        ))}
      </div>

      <div className="copilot-section">
        <h3>CAPA Recommendation</h3>
        {capa_suggestions.map((c, i) => (
          <div className="suggestion-card" key={i}>
            <div className="meta">
              {c.type} · {c.owner_function}
            </div>
            {c.action}
          </div>
        ))}
      </div>

      <div className="copilot-section">
        <h3>Complaint Summary</h3>
        <div style={{ fontSize: 13, lineHeight: 1.55 }}>{summary}</div>
      </div>
    </div>
  );
}
