const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const connectDB = require("../lib/db");
const visitorRoutes = require("../routes/visitorRoutes");

const app = express();

// Enable CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON bodies
app.use(express.json());

// Serve static assets from public directory
app.use(express.static(path.join(__dirname, "../public")));

// Mount visitor routes under both /api/visitors and /visitors
app.use("/api/visitors", visitorRoutes);
app.use("/visitors", visitorRoutes);

// Health check endpoint (accessible at /api/health and /health)
app.get(["/api/health", "/health"], async (req, res) => {
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    if (process.env.MONGO_URI) {
      await connectDB();
      dbStatus = mongoose.connection.readyState === 1 ? "connected" : "connecting";
    } else {
      dbStatus = "missing_env_var";
      dbError = "MONGO_URI environment variable is not set in Vercel Dashboard";
    }
  } catch (err) {
    dbStatus = "error";
    dbError = err.message || "Failed to connect to MongoDB";
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      error: dbError
    },
    environment: process.env.NODE_ENV || "production"
  });
});

// Root API directory
app.get("/api", (req, res) => {
  res.json({
    name: "Portfolio Analytics API",
    status: "active",
    endpoints: {
      health: "/api/health",
      getVisitors: "/api/visitors (GET)",
      addVisitor: "/api/visitors (POST)",
      testVisitor: "/api/visitors/test (POST)"
    }
  });
});

// Fallback to index.html for root or SPA frontend routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../public", "index.html"), (err) => {
    if (err) {
      next(err);
    }
  });
});

// Global Error Handler to prevent function invocation crashes
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred"
  });
});

module.exports = app;
