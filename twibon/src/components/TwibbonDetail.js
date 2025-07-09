import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TwibbonEditor from "./TwibbonEditor";
import { slugify } from "./utils";
import Spinner from "./Spinner";

function TwibbonDetail() {
  const { slug } = useParams();
  const [twibbons, setTwibbons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [twibbon, setTwibbon] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/twibbons")
      .then((res) => res.json())
      .then((data) => {
        setTwibbons(data);
        const found = data.find((t) => slugify(t.name) === slug);
        setTwibbon(found || null);
        setLoading(false);
      });
  }, [slug]);

  const shareUrl = window.location.href;
  const shareText = `Cek twibbon keren ini!${twibbon && twibbon.description ? "\n" + twibbon.description : ""}`;

  function shareToWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  }
  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  }
  function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  }
  function copyLink() {
    navigator.clipboard.writeText(shareText + " " + shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading)
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={56} />
      </div>
    );

  if (!twibbon) {
    return (
      <div className="App">
        <h2>Twibbon tidak ditemukan</h2>
        <Link to="/">Kembali ke beranda</Link>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-header">
        <h1 className="app-title">🎭 {twibbon.name}</h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1.2rem 0 0.5rem 0" }}>
          <img
            src={"http://localhost:5000" + twibbon.url}
            alt={twibbon.name}
            style={{
              maxWidth: "180px",
              maxHeight: "180px",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              background: "#fff",
              border: "2px solid #e0e7ef",
              marginBottom: "0.7rem",
              objectFit: "contain",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
        <div className="twibbon-detail-desc">{twibbon.description || ""}</div>
        {/* Share buttons */}
        {/* <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "0.7rem" }}>
          <button onClick={shareToWhatsApp} style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer" }}>
            WhatsApp
          </button>
          <button onClick={shareToFacebook} style={{ background: "#4267b2", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer" }}>
            Facebook
          </button>
          <button onClick={shareToTwitter} style={{ background: "#1da1f2", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer" }}>
            Twitter
          </button>
          <button onClick={copyLink} style={{ background: "#eee", color: "#333", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 600, cursor: "pointer" }}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div> */}
        <Link to="/" className="back-link">
          ← Kembali ke beranda
        </Link>
      </div>
      <div className="editor-section">
        <TwibbonEditor twibbonSrc={"http://localhost:5000" + twibbon.url} twibbonName={twibbon.name} twibbonSlug={slugify(twibbon.name)} />
      </div>
    </div>
  );
}

export default TwibbonDetail;
