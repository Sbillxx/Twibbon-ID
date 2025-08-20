import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import TwibbonDetail from "./components/TwibbonDetail";
import AdminLogin from "./components/AdminLogin";
import RequireAuth from "./components/RequireAuth";
import Spinner from "./components/Spinner";
import { slugify } from "./components/utils";
import FeedbackWidget from "./components/FeedbackWidget";
import "./App.css";

function TwibbonDescription({ text }) {
  const [expanded, setExpanded] = useState(false);
  const lineClampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "pre-line",
  };
  if (!text) return null;
  const isLong = text.split("\n").length > 4 || text.length > 200;
  return (
    <>
      <span className="twibbon-description" style={!expanded && isLong ? lineClampStyle : { whiteSpace: "pre-line" }}>
        {text}
      </span>
      {isLong && (
        <button
          type="button"
          className="read-more-btn"
          onClick={(e) => {
            e.preventDefault();
            setExpanded((v) => !v);
          }}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9em",
            marginTop: 4,
            padding: 0,
            textDecoration: "underline",
            display: "block",
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const [twibbons, setTwibbons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://www.idrisiyyah.com:5000/api/twibbons")
      .then((res) => res.json())
      .then((data) => {
        setTwibbons(data);
        setLoading(false);
      });
  }, []);

  const isUserPage = !location.pathname.startsWith("/!/admin") && !location.pathname.startsWith("/!/admin-login");

  return (
    <>
      <Routes>
        <Route path="/!/admin-login" element={<AdminLogin />} />
        <Route
          path="/!/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route path="/:slug" element={<TwibbonDetail />} />
        <Route
          path="/"
          element={
            <div className="App">
              <div className="app-header">
                <div className="logo-container">
                  <img src="/logoIDFrame-white.png" alt="IDFrame Logo" className="app-logo" />
                </div>
                <p className="app-subtitle">COBAIN DEHH, TWIBBONIZE MAH DAH BAYAR BJIRR😂😂</p>
              </div>

              <div className="twibbon-selection">
                <h2 className="selection-title">Pilih Twibbon Kamu</h2>
                {loading ? (
                  <Spinner size={56} />
                ) : (
                  <div className="twibbon-grid">
                    {twibbons.map((twibbon) => (
                      <Link to={`/${slugify(twibbon.name)}`} key={twibbon.id} className="twibbon-option">
                        <img src={"http://www.idrisiyyah.com:5000" + twibbon.url} alt={twibbon.name} className="twibbon-preview" />
                        <div className="twibbon-info">
                          <span className="twibbon-label">{twibbon.name}</span>
                          <TwibbonDescription text={twibbon.description} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="welcome-message">
                <div className="welcome-content">
                  <h3>✨ Ayo Mulai</h3>
                  <p>Silahkan pilih twibbon di atas untuk memulai membuat twibbon sendiri!</p>
                  <div className="feature-list">
                    <div className="feature-item">
                      <span className="feature-icon">📐</span>
                      <span>Flexible aspect ratios (1:1, 9:16, 3:4)</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🎯</span>
                      <span>Smart cropping with frame detection</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">💾</span>
                      <span>High-quality output</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
      {isUserPage && <FeedbackWidget />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
