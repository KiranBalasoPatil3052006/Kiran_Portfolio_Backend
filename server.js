const express = require("express");
const path = require("path");
require("dotenv").config();

const app = require("./api/index");
const connectDB = require("./lib/db");

// Serve static frontend assets from public directory for local development
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html for root or frontend routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard available at http://localhost:${PORT}`);
  console.log(`🩺 Health check at http://localhost:${PORT}/api/health`);

  try {
    if (process.env.MONGO_URI) {
      await connectDB();
      console.log("✅ Connected to MongoDB");
    } else {
      console.warn("⚠️ MONGO_URI is not configured in .env");
    }
  } catch (err) {
    console.error("⚠️ MongoDB connection warning:", err.message);
    console.warn("👉 Make sure your MongoDB URI and network access / credentials are valid in .env");
  }
});

module.exports = server;
