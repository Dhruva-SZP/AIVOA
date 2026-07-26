import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import ComplaintIntake from "./components/ComplaintIntake.jsx";
import LogComplaintForm from "./components/LogComplaintForm.jsx";
import AICopilotPanel from "./components/AICopilotPanel.jsx";
import ComplaintsTable from "./components/ComplaintsTable.jsx";

export default function App() {
  const [view, setView] = useState("intake");

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <main className="main">
        {view === "intake" ? (
          <>
            <TopBar
              eyebrow="Customer Complaint Module"
              title="Log Customer Complaint"
              subtitle="Paste a complaint email or upload a PDF/.eml — the AI Copilot extracts and assesses it automatically."
            />
            <div className="grid-2">
              <div>
                <ComplaintIntake />
                <LogComplaintForm />
              </div>
              <AICopilotPanel />
            </div>
          </>
        ) : (
          <>
            <TopBar
              eyebrow="Customer Complaint Module"
              title="Complaint Register"
              subtitle="All complaints logged so far, with AI-assessed risk level."
            />
            <ComplaintsTable />
          </>
        )}
      </main>
    </div>
  );
}
