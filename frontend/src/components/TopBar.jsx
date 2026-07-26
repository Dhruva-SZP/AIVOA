import React from "react";

export default function TopBar({ eyebrow, title, subtitle }) {
  return (
    <div className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
