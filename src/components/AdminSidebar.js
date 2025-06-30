import React from "react";
import "./AdminSidebar.css";

const AdminSidebar = ({ current, onNavigate, open, onClose }) => {
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
      </ul>
    </nav>
  );
};

export default AdminSidebar;
