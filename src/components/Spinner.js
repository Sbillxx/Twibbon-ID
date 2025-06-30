import React from "react";
import "./Spinner.css";

function Spinner({ size = 48 }) {
  return (
    <div className="spinner-container">
      <svg className="spinner" width={size} height={size} viewBox="0 0 50 50">
        <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
    </div>
  );
}

export default Spinner;
