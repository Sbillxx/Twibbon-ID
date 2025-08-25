import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL =", API_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_logged_in", "true");
        navigate("/!/admin");
      } else {
        setError(data.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">Login Admin</h1>
      </div>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </div>
        <div className="form-group" style={{ position: "relative" }}>
          <label>Password</label>
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight: "2.2rem" }} />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: "0.7rem",
              top: "70%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: showPassword ? "#394ca0" : "#888",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              height: "24px",
              width: "24px",
            }}
            title={showPassword ? "Sembunyikan password" : "Lihat password"}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
          >
            {showPassword ? (
              // Mata ketutup
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
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading} style={{ position: "relative", minHeight: 40 }}>
          {loading ? <Spinner size={28} /> : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
