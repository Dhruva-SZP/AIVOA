import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaints } from "../store/complaintsSlice.js";

const riskColor = (level) => {
  if (level === "Critical") return "var(--critical)";
  if (level === "Minor") return "var(--minor)";
  if (level === "Major") return "var(--major)";
  return "var(--ink-soft)";
};

export default function ComplaintsTable() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.complaints.items);
  const listStatus = useSelector((s) => s.complaints.listStatus);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  return (
    <div className="card">
      <h2>
        <span className="dot" /> Complaint Register
      </h2>
      {listStatus === "loading" && items.length === 0 ? (
        <div className="copilot-empty">Loading complaints...</div>
      ) : items.length === 0 ? (
        <div className="copilot-empty">
          No complaints logged yet. Go to "Log Complaint" to submit the first one.
        </div>
      ) : (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Complaint #</th>
              <th>Product</th>
              <th>Batch</th>
              <th>Category</th>
              <th>Risk</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.complaint_number}</td>
                <td>{c.product_name || "—"}</td>
                <td>{c.batch_number || "—"}</td>
                <td>{c.complaint_category || "—"}</td>
                <td>
                  {c.risk_level ? (
                    <span style={{ color: riskColor(c.risk_level), fontWeight: 700, fontSize: 12.5 }}>
                      {c.risk_level}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span className="status-chip">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
