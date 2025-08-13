import React, { useState, useEffect } from "react";

const FEEDBACK_API = "http://localhost:5000/api/feedback";

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [feedbacks] = useState([]);
  const [loading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) fetchFeedbacks();
    if (!open) {
      setSuccess("");
      setError("");
    }
    // eslint-disable-next-line
  }, [open]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(FEEDBACK_API);
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (e) {
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!message.trim()) {
      setError("Feedback tidak boleh kosong!");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(FEEDBACK_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, name }),
      });
      if (!res.ok) throw new Error("Gagal mengirim feedback");
      setMessage("");
      setName("");
      setSuccess("Feedback terkirim, terima kasih!");
      fetchFeedbacks();
    } catch (e) {
      setError("Gagal mengirim feedback");
    }
    setSending(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 9999,
          background: "#4267b2",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Kirim Feedback"
        aria-label="Kirim Feedback"
      >
        {/* SVG chat icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Popup Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30,40,80,0.25)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
              padding: 24,
              width: "95vw",
              maxWidth: 380,
              minWidth: 280,
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              color: "#222",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 28,
                color: "#888",
                cursor: "pointer",
              }}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 style={{ margin: "0 0 12px 0", textAlign: "center", color: "#4267b2" }}>💬 Feedback</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis feedback kamu di sini..."
                rows={3}
                style={{ width: "100%", borderRadius: 8, border: "1.5px solid #bcd", padding: 8, resize: "vertical", fontSize: 15, boxSizing: "border-box" }}
                maxLength={500}
                required
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama (opsional, kosong = Anonim)"
                style={{ width: "100%", borderRadius: 8, border: "1.5px solid #bcd", padding: 8, marginTop: 8, fontSize: 15, boxSizing: "border-box" }}
                maxLength={40}
              />
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: "#4267b2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: sending ? "not-allowed" : "pointer",
                  opacity: sending ? 0.7 : 1,
                  transition: "opacity 0.2s",
                  boxSizing: "border-box",
                }}
              >
                {sending ? "Mengirim..." : "Kirim Feedback"}
              </button>
              {error && <div style={{ color: "#e11d48", marginTop: 6, fontSize: 14 }}>{error}</div>}
              {success && <div style={{ color: "#22c55e", marginTop: 6, fontSize: 14 }}>{success}</div>}
            </form>
            {/* <div style={{ maxHeight: 180, overflowY: "auto", borderRadius: 8, background: "#f6f8fa", padding: 8, border: "1px solid #e0e7ef" }}>
              {loading ? (
                <div style={{ textAlign: "center", color: "#888" }}>Memuat...</div>
              ) : feedbacks.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888" }}>Belum ada feedback.</div>
              ) : (
                feedbacks.map((fb) => (
                  <div key={fb.id} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #e0e7ef" }}>
                    <div style={{ fontSize: 15, color: "#222", marginBottom: 2, whiteSpace: "pre-line" }}>{fb.message}</div>
                    <div style={{ fontSize: 13, color: "#4267b2", fontWeight: 500 }}>
                      {fb.name || "Anonim"} <span style={{ color: "#888", fontWeight: 400, fontSize: 12 }}>• {new Date(fb.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                  </div>
                ))
              )}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackWidget;
