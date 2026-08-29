const express = require("express");
const Visitor = require("../models/Visitor");
const connectDB = require("../lib/db");
const router = express.Router();

// Middleware to ensure DB connection
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error in visitor routes:", error.message);
    res.status(503).json({
      success: false,
      error: "Database Connection Error",
      message: error.message || "Failed to connect to MongoDB",
      hint: "Ensure MONGO_URI is set correctly with valid credentials in Vercel Environment Variables or .env"
    });
  }
});

/* Add visitor */
router.post("/", async (req, res) => {
  try {
    const { name, skipped } = req.body;

    const visitor = new Visitor({
      name: name && name.trim() ? name.trim() : (skipped ? "Anonymous Visitor" : "Visitor"),
      skipped: Boolean(skipped),
      visitedAt: new Date()
    });

    await visitor.save();
    res.status(201).json({
      success: true,
      visitor
    });
  } catch (error) {
    console.error("Error creating visitor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record visitor",
      message: error.message
    });
  }
});

/* Add test visitor for verification */
router.post("/test", async (req, res) => {
  try {
    const isSkipped = Math.random() > 0.6;
    const testNames = ["Alex Rivera", "Sophia Chen", "Rohan Mehta", "Elena Rostova", "Liam O'Connor"];
    const randomName = isSkipped ? "Anonymous Visitor" : testNames[Math.floor(Math.random() * testNames.length)];

    const visitor = new Visitor({
      name: randomName,
      skipped: isSkipped,
      visitedAt: new Date()
    });

    await visitor.save();
    res.status(201).json({
      success: true,
      message: "Test visitor created successfully",
      visitor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create test visitor",
      message: error.message
    });
  }
});

/* Get stats */
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 }).limit(200);
    const total = await Visitor.countDocuments();
    const skippedCount = await Visitor.countDocuments({ skipped: true });
    const enteredCount = total - skippedCount;

    res.json({
      success: true,
      total,
      skippedCount,
      enteredCount,
      visitors
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch visitor stats",
      message: error.message
    });
  }
});

module.exports = router;
