const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "twibbon_secret_key_123", // ganti dengan secret yang lebih aman di production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

const UPLOADS_DIR = path.join(__dirname, "uploads");

// MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "twibbon_db",
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "twibbon_db",
  port: process.env.DB_PORT || 3306, // <-- ini harus ada!
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || "twibbon_secret_key_123",
    // ...
  })
);

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

// --- AUTH ENDPOINTS ---
// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  db.query("SELECT * FROM sysuser WHERE username = ? AND is_active = 1", [username], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: "User not found or inactive" });
    const user = rows[0];
    // Cek hash
    let passwordMatch = false;
    if (user.password.startsWith("$2b$")) {
      // Sudah hash bcrypt
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Masih plain text (migrasi awal)
      passwordMatch = password === user.password;
    }
    if (!passwordMatch) return res.status(401).json({ error: "Wrong password" });
    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    // Update last_login
    db.query("UPDATE sysuser SET last_login = NOW() WHERE id = ?", [user.id]);
    res.json({ success: true, username: user.username });
  });
});

// Cek status login
app.get("/api/auth/check", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Ganti username & password
app.post("/api/auth/change-credentials", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }
  db.query("SELECT * FROM sysuser WHERE id = ?", [req.session.userId], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    const user = rows[0];
    // Cek password lama
    let passwordMatch = false;
    if (user.password.startsWith("$2b$")) {
      passwordMatch = await bcrypt.compare(oldPassword, user.password);
    } else {
      passwordMatch = oldPassword === user.password;
    }
    if (!passwordMatch) return res.status(401).json({ error: "Password lama salah" });
    // Hash password baru
    const hash = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE sysuser SET username = ?, password = ?, updated_at = NOW() WHERE id = ?", [username, hash, user.id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      // Update session username
      req.session.username = username;
      res.json({ success: true });
    });
  });
});

// Tambah endpoint feedback
app.post("/api/feedback", (req, res) => {
  const { message, name } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: "Feedback tidak boleh kosong" });
  const sender = name && name.trim() ? name.trim() : "Anonim";
  db.query("INSERT INTO feedback (message, name, created_at) VALUES (?, ?, NOW())", [message, sender], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT * FROM feedback WHERE id = ?", [result.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// Ambil semua feedback (untuk admin panel)
app.get("/api/feedback", (req, res) => {
  db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Hapus feedback
app.delete("/api/feedback/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query("DELETE FROM feedback WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Twibbon backend running on http://localhost:${PORT}`);
});
