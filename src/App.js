import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TwibbonEditor from "./components/TwibbonEditor";
import AdminPage from "./components/AdminPage";
import "./App.css";

function App() {
  const [selectedTwibbon, setSelectedTwibbon] = useState(null);
  const [twibbons, setTwibbons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/twibbons")
      .then((res) => res.json())
      .then((data) => setTwibbons(data));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
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
                <div className="twibbon-grid">
                  {twibbons.map((twibbon) => (
                    <div key={twibbon.id} className={`twibbon-option ${selectedTwibbon === "http://localhost:5000" + twibbon.url ? "selected" : ""}`} onClick={() => setSelectedTwibbon("http://localhost:5000" + twibbon.url)}>
                      <img src={"http://localhost:5000" + twibbon.url} alt={twibbon.name} className="twibbon-preview" />
                      <div className="twibbon-info">
                        <span className="twibbon-label">{twibbon.name}</span>
                        <span className="twibbon-description">{twibbon.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTwibbon && (
                <div className="editor-section">
                  <TwibbonEditor twibbonSrc={selectedTwibbon} />
                </div>
              )}

              {!selectedTwibbon && (
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
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
