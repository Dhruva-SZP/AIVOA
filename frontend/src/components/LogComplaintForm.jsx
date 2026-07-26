import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setField, saveComplaint, resetForm } from "../store/complaintsSlice.js";
import { clearAnalysis } from "../store/aiSlice.js";

const CATEGORIES = [
  "Quality Defect",
  "Packaging/Labeling",
  "Efficacy",
  "Adverse Event",
  "Stability",
  "Documentation",
  "Delivery/Logistics",
  "Other",
];

function Field({ name, label, aiFilled, children }) {
  return (
    <div className="field">
      <label>
        {label} {aiFilled && <span className="hint">✦ AI-filled</span>}
      </label>
      {children}
    </div>
  );
}

export default function LogComplaintForm() {
  const dispatch = useDispatch();
  const form = useSelector((s) => s.complaints.formDraft);
  const aiFilledFields = useSelector((s) => s.complaints.aiFilledFields);
  const saveStatus = useSelector((s) => s.complaints.saveStatus);

  const onChange = (field, value) => dispatch(setField({ field, value }));
  const isFilled = (f) => aiFilledFields.includes(f);

  const handleSave = async () => {
    await dispatch(saveComplaint());
  };

  const handleReset = () => {
    dispatch(resetForm());
    dispatch(clearAnalysis());
  };

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h2>
        <span className="dot" /> Log Customer Complaint
      </h2>

      <div className="form-grid">
        <Field name="customer_name" label="Customer Name" aiFilled={isFilled("customer_name")}>
          <input
            value={form.customer_name}
            className={isFilled("customer_name") ? "ai-filled" : ""}
            onChange={(e) => onChange("customer_name", e.target.value)}
          />
        </Field>
        <Field name="customer_email" label="Customer Email" aiFilled={isFilled("customer_email")}>
          <input
            value={form.customer_email}
            className={isFilled("customer_email") ? "ai-filled" : ""}
            onChange={(e) => onChange("customer_email", e.target.value)}
          />
        </Field>
        <Field name="product_name" label="Product Name" aiFilled={isFilled("product_name")}>
          <input
            value={form.product_name}
            className={isFilled("product_name") ? "ai-filled" : ""}
            onChange={(e) => onChange("product_name", e.target.value)}
          />
        </Field>
        <Field name="batch_number" label="Batch / Lot Number" aiFilled={isFilled("batch_number")}>
          <input
            value={form.batch_number}
            className={isFilled("batch_number") ? "ai-filled" : ""}
            onChange={(e) => onChange("batch_number", e.target.value)}
          />
        </Field>
        <Field name="market_country" label="Market / Country" aiFilled={isFilled("market_country")}>
          <input
            value={form.market_country}
            className={isFilled("market_country") ? "ai-filled" : ""}
            onChange={(e) => onChange("market_country", e.target.value)}
          />
        </Field>
        <Field name="quantity_affected" label="Quantity Affected" aiFilled={isFilled("quantity_affected")}>
          <input
            value={form.quantity_affected}
            className={isFilled("quantity_affected") ? "ai-filled" : ""}
            onChange={(e) => onChange("quantity_affected", e.target.value)}
          />
        </Field>
        <Field name="complaint_category" label="Complaint Category" aiFilled={isFilled("complaint_category")}>
          <select
            value={form.complaint_category}
            className={isFilled("complaint_category") ? "ai-filled" : ""}
            onChange={(e) => onChange("complaint_category", e.target.value)}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field name="date_of_occurrence" label="Date of Occurrence" aiFilled={isFilled("date_of_occurrence")}>
          <input
            placeholder="YYYY-MM-DD"
            value={form.date_of_occurrence}
            className={isFilled("date_of_occurrence") ? "ai-filled" : ""}
            onChange={(e) => onChange("date_of_occurrence", e.target.value)}
          />
        </Field>
        <div className="field full">
          <label>
            Description {isFilled("description") && <span className="hint">✦ AI-filled</span>}
          </label>
          <textarea
            rows={4}
            value={form.description}
            className={isFilled("description") ? "ai-filled" : ""}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleSave} disabled={saveStatus === "loading"}>
          {saveStatus === "loading" ? "Saving..." : "Save Complaint"}
        </button>
        <button className="btn btn-ghost" onClick={handleReset}>
          Clear Form
        </button>
        {saveStatus === "succeeded" && (
          <span style={{ color: "var(--minor)", fontSize: 13, fontWeight: 600, alignSelf: "center" }}>
            ✓ Saved to Complaint Register
          </span>
        )}
      </div>
    </div>
  );
}
