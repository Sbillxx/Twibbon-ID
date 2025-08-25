import React, { useState } from "react";
import "./FrameUploadForm.css";


const API_URL = process.env.REACT_APP_API_URL;
const FEEDBACK_API = `${API_URL}/api/feedback`;
const UPLOAD_API = `${API_URL}/api/upload`;


const FrameUploadForm = ({ onUploaded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !file) {
      setError("Name and file are required!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/api/twibbons`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      setSuccess("Frame uploaded!");
      setName("");
      setDescription("");
      setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form style={{ maxWidth: "100%", width: "100%", margin: "2rem 0", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "24px 5px" }} className="frame-upload-form" onSubmit={handleSubmit}>
      <h2>Upload Twibbon Frame</h2>
      <label>Frame Name*</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <label>Description / Aspect Ratio</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{ resize: "vertical", fontFamily: "inherit", fontSize: "1rem", padding: "0.6rem", borderRadius: 6, border: "1px solid #c3c3c3" }}
        placeholder="Tulis deskripsi frame di sini... (bisa multi-baris)"
      />
      <label>Frame Image*</label>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
    </form>
  );
};

export default FrameUploadForm;
