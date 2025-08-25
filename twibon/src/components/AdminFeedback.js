import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;
const FEEDBACK_API = `${API_URL}/api/feedback`;
console.log("API_URL =", API_URL);

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(FEEDBACK_API);
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Gagal memuat feedback");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await fetch(`${FEEDBACK_API}/${id}`, { method: "DELETE" });
      fetchFeedbacks();
    } catch {}
    setDeleting(null);
    setDeleteId(null);
  };

  return (
    <div style={{ maxWidth: "100%", width: "100%", margin: "2rem 0", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "24px 5px" }}>
      <h2 style={{ textAlign: "center", color: "#4267b2", marginBottom: 18 }}>Feedback Pengguna</h2>
      {loading ? (
        <div style={{ textAlign: "center", color: "#888" }}>Memuat...</div>
      ) : error ? (
        <div style={{ color: "#e11d48", textAlign: "center" }}>{error}</div>
      ) : feedbacks.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>Belum ada feedback.</div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {feedbacks.map((fb) => (
            <div key={fb.id} style={{ borderBottom: "1px solid #e0e7ef", marginBottom: 12, paddingBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, color: "#222", marginBottom: 2, whiteSpace: "pre-line" }}>{fb.message}</div>
                <div style={{ fontSize: 13, color: "#4267b2", fontWeight: 500 }}>
                  {fb.name || "Anonim"} <span style={{ color: "#888", fontWeight: 400, fontSize: 12 }}>• {new Date(fb.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
              </div>
              <button
                onClick={() => setDeleteId(fb.id)}
                disabled={deleting === fb.id}
                style={{
                  background: "#e11d48",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: deleting === fb.id ? "not-allowed" : "pointer",
                  opacity: deleting === fb.id ? 0.7 : 1,
                  marginLeft: 8,
                  transition: "opacity 0.2s",
                }}
                title="Hapus feedback"
              >
                {deleting === fb.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
          {deleteId && (
            <div className="edit-modal-backdrop" onClick={() => setDeleteId(null)}>
              <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Anda yakin akan menghapus feedback ini?</h3>
                <div className="edit-modal-actions">
                  <button className="edit-cancel" onClick={() => setDeleteId(null)}>
                    Batal
                  </button>
                  <button className="edit-save" style={{ background: "#e11d48", color: "#fff" }} onClick={() => handleDelete(deleteId)} disabled={deleting === deleteId}>
                    {deleting === deleteId ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;
