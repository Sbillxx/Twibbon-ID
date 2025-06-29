import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import FrameUploadForm from "./FrameUploadForm";
import FrameList from "./FrameList";
import "./AdminPage.css";

const AdminPage = () => {
  const [page, setPage] = useState("upload");
  const [refresh, setRefresh] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <button className={`admin-hamburger flat${sidebarOpen ? " sidebar-open" : ""}`} onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <AdminSidebar
        current={page}
        onNavigate={(p) => {
          setPage(p);
          setSidebarOpen(false);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="admin-main">
        {page === "upload" && <FrameUploadForm onUploaded={() => setRefresh((r) => !r)} />}
        {page === "list" && <FrameList refresh={refresh} />}
      </main>
    </div>
  );
};

export default AdminPage;
