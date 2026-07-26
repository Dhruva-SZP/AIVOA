import React from "react";

const NAV = [
  { key: "intake", label: "Log Complaint", icon: "＋" },
  { key: "register", label: "Complaint Register", icon: "☰" },
];

export default function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          AIVOA <span>QMS</span>
        </div>
        <div className="tagline">Complaint Management</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${view === item.key ? "active" : ""}`}
            onClick={() => setView(item.key)}
          >
            <span>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        Pharmaceutical API / FDF
        <br />
        Customer Complaint Module
        <br />
        AI Copilot powered by Groq + LangGraph
      </div>
    </aside>
  );
}
