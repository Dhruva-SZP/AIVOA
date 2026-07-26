import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { runAnalyzeText, runAnalyzeUpload, clearAnalysis } from "../store/aiSlice.js";
import { setRawText, setSource, populateFromAI } from "../store/complaintsSlice.js";

export default function ComplaintIntake() {
  const dispatch = useDispatch();
  const rawText = useSelector((s) => s.complaints.rawText);
  const aiStatus = useSelector((s) => s.ai.status);
  const aiResult = useSelector((s) => s.ai.result);
  const aiError = useSelector((s) => s.ai.error);

  const [mode, setMode] = useState("paste"); // paste | upload
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleRunPaste = () => {
    dispatch(setSource({ sourceType: "text" }));
    dispatch(runAnalyzeText({ rawText, sourceType: "text" })).then((action) => {
      if (action.payload) dispatch(populateFromAI(action.payload));
    });
  };

  const handleFile = (f) => {
    setFile(f);
    const sourceType = f.name.toLowerCase().endsWith(".pdf")
      ? "pdf"
      : f.name.toLowerCase().endsWith(".eml")
      ? "email"
      : "text";
    dispatch(setSource({ sourceType, sourceFilename: f.name }));
  };

  const handleRunUpload = () => {
    if (!file) return;
    dispatch(runAnalyzeUpload(file)).then((action) => {
      if (action.payload) dispatch(populateFromAI(action.payload));
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const switchMode = (m) => {
    setMode(m);
    dispatch(clearAnalysis());
  };

  return (
    <div className="card">
      <h2>
        <span className="dot" /> Complaint Intake
      </h2>

      <div className="tabs">
        <div className={`tab ${mode === "paste" ? "active" : ""}`} onClick={() => switchMode("paste")}>
          Paste Text / Email
        </div>
        <div className={`tab ${mode === "upload" ? "active" : ""}`} onClick={() => switchMode("upload")}>
          Upload PDF / .eml
        </div>
      </div>

      {mode === "paste" ? (
        <>
          <textarea
            className="intake-textarea"
            placeholder="Paste the customer's complaint email, call transcript, or letter text here..."
            value={rawText}
            onChange={(e) => dispatch(setRawText(e.target.value))}
          />
          <div className="btn-row">
            <button
              className="btn btn-teal"
              disabled={!rawText.trim() || aiStatus === "loading"}
              onClick={handleRunPaste}
            >
              {aiStatus === "loading" ? (
                <>
                  <span className="spinner" /> Running AI Copilot...
                </>
              ) : (
                "Run AI Copilot"
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className={`dropzone ${dragActive ? "drag" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
          >
            {file ? (
              <>📄 {file.name}</>
            ) : (
              <>Drag &amp; drop a complaint PDF or .eml file, or click to browse</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.eml,.txt"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
          <div className="btn-row">
            <button
              className="btn btn-teal"
              disabled={!file || aiStatus === "loading"}
              onClick={handleRunUpload}
            >
              {aiStatus === "loading" ? (
                <>
                  <span className="spinner" /> Running AI Copilot...
                </>
              ) : (
                "Run AI Copilot"
              )}
            </button>
          </div>
        </>
      )}

      {aiStatus === "failed" && <div className="error-banner">{aiError}</div>}
      {aiResult && aiStatus === "succeeded" && (
        <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--teal)", fontWeight: 600 }}>
          ✓ AI Copilot populated the form below. Review, edit if needed, then save.
        </div>
      )}
    </div>
  );
}
