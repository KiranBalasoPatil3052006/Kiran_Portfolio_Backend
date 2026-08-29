const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../lib/db");
const visitorRoutes = require("../routes/visitorRoutes");
const getDashboardHtml = require("./dashboardHtml");

const app = express();

// Enable CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON bodies
app.use(express.json());

// Mount visitor routes under both /api/visitors and /visitors
app.use("/api/visitors", visitorRoutes);
app.use("/visitors", visitorRoutes);

// Health check endpoint
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

// Serve the Analytics Dashboard HTML for root, /api, /dashboard, /stats
app.get(["/", "/api", "/dashboard", "/api/dashboard", "/stats", "/api/stats", "/index.html"], (req, res) => {
  // If client explicitly requests JSON for /api or accepts only JSON
  if (req.path === "/api" && req.headers.accept && req.headers.accept.includes("application/json") && !req.headers.accept.includes("text/html")) {
    return res.json({
      name: "Portfolio Analytics API",
      status: "active",
      endpoints: {
        health: "/api/health",
        getVisitors: "/api/visitors (GET)",
        addVisitor: "/api/visitors (POST)",
        testVisitor: "/api/visitors/test (POST)"
      }
    });
  }

  // Otherwise serve the Dashboard UI
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(getDashboardHtml());
});

// Fallback for all other routes
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(getDashboardHtml());
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Serverless error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred"
  });
});

module.exports = app;
