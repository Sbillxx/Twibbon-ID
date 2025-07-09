import React from "react";
import "./AdminSidebar.css";

const AdminSidebar = ({ current, onNavigate, open, onClose, onLogout }) => {
  return (
    <nav className={`admin-sidebar${open ? " open" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Admin Panel</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          ×
        </button>
      </div>
      <ul className="sidebar-menu">
        <li
          data-icon="⬆️"
          className={current === "upload" ? "active" : ""}
          onClick={() => {
            onNavigate("upload");
          }}
        >
          Upload Frame
        </li>
        <li
          data-icon="🖼️"
          className={current === "list" ? "active" : ""}
          onClick={() => {
            onNavigate("list");
          }}
        >
          List Frames
        </li>
        <li
          data-icon="👤"
          className={current === "account" ? "active" : ""}
          onClick={() => {
            onNavigate("account");
          }}
        >
          Akun
        </li>
        <li
          data-icon="💬"
          className={current === "feedback" ? "active" : ""}
          onClick={() => {
            onNavigate("feedback");
          }}
        >
          Feedback
        </li>
      </ul>
      <div style={{ flex: 1 }} />
      <div style={{ position: "absolute", bottom: 24, left: 0, width: "100%" }}>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;
