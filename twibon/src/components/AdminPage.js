import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import FrameUploadForm from "./FrameUploadForm";
import FrameList from "./FrameList";
import AdminFeedback from "./AdminFeedback";
import "./AdminPage.css";
import { useNavigate } from "react-router-dom";

const EyeIcon = ({ shown, onClick }) => (
  <span
    onClick={onClick}
    className="input-icon-password"
    style={{
      position: "absolute",
      right: "0.7rem",
      top: "70%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "1.2rem",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      height: "24px",
      width: "24px",
    }}
    title={shown ? "Sembunyikan password" : "Lihat password"}
    tabIndex={0}
    role="button"
    aria-label={shown ? "Sembunyikan password" : "Lihat password"}
  >
    {shown ? (
      // Mata tertutup
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.21-3.06 3.62-5.44 6.58-6.32" />
        <path d="M1 1l22 22" />
        <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16a3.5 3.5 0 0 0 2.47-6.47" />
      </svg>
    ) : (
      // Mata kebuka
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </span>
);

const AdminPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState("upload");
  const [refresh, setRefresh] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State untuk form ganti akun
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accLoading, setAccLoading] = useState(false);
  const [accError, setAccError] = useState("");
  const [accSuccess, setAccSuccess] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // (Opsional) Prefill username dari session/localStorage jika ada
  React.useEffect(() => {
    // Bisa fetch username dari backend jika endpoint tersedia
    // Untuk sekarang, kosongkan saja
  }, [page]);

  const handleAccountChange = async (e) => {
    e.preventDefault();
    setAccError("");
    setAccSuccess("");
    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      setAccError("Semua field wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setAccError("Password baru dan konfirmasi tidak sama.");
      return;
    }
    setAccLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setAccSuccess("Berhasil mengganti username/password!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setAccError(data.error || "Gagal mengganti akun");
      }
    } catch {
      setAccError("Terjadi kesalahan jaringan");
    } finally {
      setAccLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    navigate("/!/admin-login");
  };

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
        onLogout={() => setShowLogoutModal(true)}
      />
      <main className="admin-main">
        {page === "upload" && (
          <div>
            <FrameUploadForm onUploaded={() => setRefresh((r) => !r)} />
          </div>
        )}
        {page === "list" && <FrameList refresh={refresh} />}
        {page === "account" && (
          <div style={{ maxWidth: "100%", width: "100%", margin: "2rem 0", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "24px 5px" }}>
            <h2>Ganti Username & Password</h2>
            <form className="admin-account-form" onSubmit={handleAccountChange}>
              <div className="form-group">
                <label style={{ color: "black" }}>Username Baru</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
              </div>
              <div className="form-group" style={{ position: "relative" }}>
                <label style={{ color: "black" }}>Password Lama</label>
                <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={{ paddingRight: "2.2rem" }} />
                <EyeIcon shown={showOld} onClick={() => setShowOld((v) => !v)} />
              </div>
              <div className="form-group" style={{ position: "relative" }}>
                <label style={{ color: "black" }}>Password Baru</label>
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ paddingRight: "2.2rem" }} />
                <EyeIcon shown={showNew} onClick={() => setShowNew((v) => !v)} />
              </div>
              <div className="form-group" style={{ position: "relative" }}>
                <label style={{ color: "black" }}>Konfirmasi Password Baru</label>
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ paddingRight: "2.2rem" }} />
                <EyeIcon shown={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
              </div>
              {accError && <div className="form-error">{accError}</div>}
              {accSuccess && <div className="form-success">{accSuccess}</div>}
              <button type="submit" disabled={accLoading} style={{ minWidth: 120 }}>
                {accLoading ? "Loading..." : "Ganti Akun"}
              </button>
            </form>
          </div>
        )}
        {page === "feedback" && <AdminFeedback />}
        {showLogoutModal && (
          <div className="edit-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Anda yakin ingin logout dari admin panel?</h3>
              <div className="edit-modal-actions">
                <button className="edit-cancel" onClick={() => setShowLogoutModal(false)}>
                  Batal
                </button>
                <button className="edit-save" style={{ background: "#e11d48", color: "#fff" }} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
