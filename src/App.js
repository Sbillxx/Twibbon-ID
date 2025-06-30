import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TwibbonEditor from "./components/TwibbonEditor";
import AdminPage from "./components/AdminPage";
import TwibbonDetail from "./components/TwibbonDetail";
import AdminLogin from "./components/AdminLogin";
import RequireAuth from "./components/RequireAuth";
import Spinner from "./components/Spinner";
import { slugify } from "./components/utils";
import "./App.css";

function App() {
  const [twibbons, setTwibbons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/twibbons")
      .then((res) => res.json())
      .then((data) => {
        setTwibbons(data);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
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
                <h1 className="app-title">🎭 Twibbon Kami</h1>
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
                        <img src={"http://localhost:5000" + twibbon.url} alt={twibbon.name} className="twibbon-preview" />
                        <div className="twibbon-info">
                          <span className="twibbon-label">{twibbon.name}</span>
                          <span className="twibbon-description">{twibbon.description}</span>
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
    </Router>
  );
}

export default App;
