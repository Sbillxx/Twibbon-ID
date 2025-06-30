import React, { useEffect, useState } from "react";
import "./FrameList.css";

const API_URL = "http://localhost:5000/api/twibbons";

const FrameList = ({ refresh }) => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editFrame, setEditFrame] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchFrames = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFrames(data);
    } catch (err) {
      setError("Failed to fetch frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrames();
    // eslint-disable-next-line
  }, [refresh]);

  const handleDelete = async (id, confirmed) => {
    if (!confirmed) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchFrames();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const openEdit = (frame) => {
    setEditFrame(frame);
    setEditName(frame.name);
    setEditDesc(frame.description);
  };

  const closeEdit = () => {
    setEditFrame(null);
    setEditName("");
    setEditDesc("");
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API_URL}/${editFrame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });
      closeEdit();
      fetchFrames();
    } catch (err) {
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="frame-list">
      <h2>Uploaded Frames</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="form-error">{error}</div>}
      <div className="frame-list-grid">
        {frames.map((frame) => (
          <div className="frame-card" key={frame.id}>
            <img src={`http://localhost:5000${frame.url}`} alt={frame.name} className="frame-thumb" onClick={() => setPreviewImg(`http://localhost:5000${frame.url}`)} style={{ cursor: "pointer" }} title="Click to preview" />
            <div className="frame-info">
              <div className="frame-name">{frame.name}</div>
              <div className="frame-desc">{frame.description}</div>
            </div>
            <div className="frame-actions">
              <button className="frame-edit" onClick={() => openEdit(frame)}>
                Edit
              </button>
              <button className="frame-delete" onClick={() => setDeleteId(frame.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editFrame && (
        <div className="edit-modal-backdrop" onClick={closeEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Frame</h3>
            <form onSubmit={handleEditSave}>
              <label>Frame Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              <label>Description / Aspect Ratio</label>
              <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              <div className="edit-modal-actions">
                <button type="button" onClick={closeEdit} className="edit-cancel">
                  Cancel
                </button>
                <button type="submit" className="edit-save" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {previewImg && (
        <div className="edit-modal-backdrop" onClick={() => setPreviewImg(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setPreviewImg(null)}>
              &times;
            </button>
            <img src={previewImg} alt="Preview" className="preview-img" />
          </div>
        </div>
      )}
      {deleteId && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Anda yakin akan menghapus frame twibbon ini?</h3>
            <div className="edit-modal-actions">
              <button className="edit-cancel" onClick={() => setDeleteId(null)}>
                Batal
              </button>
              <button
                className="edit-save"
                style={{ background: "#e11d48", color: "#fff" }}
                onClick={async () => {
                  await handleDelete(deleteId, true);
                  setDeleteId(null);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameList;
