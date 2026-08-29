const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const connectDB = require("../lib/db");
const visitorRoutes = require("../routes/visitorRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Mount API routes
app.use("/api/visitors", visitorRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";
  let dbError = null;

  try {
    if (process.env.MONGO_URI) {
      await connectDB();
      dbStatus = mongoose.connection.readyState === 1 ? "connected" : "connecting";
    } else {
      dbStatus = "missing_env_var";
      dbError = "MONGO_URI is not set";
    }
  } catch (err) {
    dbStatus = "error";
    dbError = err.message;
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

// Root API response (for direct /api requests)
app.get("/api", (req, res) => {
  res.json({
    name: "Portfolio Analytics API",
    status: "active",
    endpoints: {
      health: "/api/health",
      getVisitors: "/api/visitors (GET)",
      addVisitor: "/api/visitors (POST)"
    }
  });
});

module.exports = app;
