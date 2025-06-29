const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, "uploads");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "twibbon_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, name + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

// List all twibbons
app.get("/api/twibbons", (req, res) => {
  db.query("SELECT * FROM twibbons ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Upload a new twibbon
app.post("/api/twibbons", upload.single("file"), (req, res) => {
  const { name, description } = req.body;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filename = req.file.filename;
  const url = `/uploads/${filename}`;
  db.query("INSERT INTO twibbons (name, description, filename, url) VALUES (?, ?, ?, ?)", [name, description, filename, url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT * FROM twibbons WHERE id = ?", [result.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// Delete a twibbon
app.delete("/api/twibbons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query("SELECT * FROM twibbons WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const twibbon = rows[0];
    db.query("DELETE FROM twibbons WHERE id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // Delete file
      fs.unlinkSync(path.join(UPLOADS_DIR, twibbon.filename));
      res.json({ success: true });
    });
  });
});

// Update a twibbon (name & description)
app.put("/api/twibbons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  db.query("UPDATE twibbons SET name = ?, description = ? WHERE id = ?", [name, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT * FROM twibbons WHERE id = ?", [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

app.listen(PORT, () => {
  console.log(`Twibbon backend running on http://localhost:${PORT}`);
});
