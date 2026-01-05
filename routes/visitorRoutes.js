const express = require("express");
const Visitor = require("../models/Visitor");
const router = express.Router();

/* Add visitor */
router.post("/", async (req, res) => {
  const visitor = new Visitor(req.body);
  await visitor.save();
  res.json(visitor);
});

/* Get stats */
router.get("/", async (req, res) => {
  const visitors = await Visitor.find().sort({ visitedAt: -1 });
  const skippedCount = visitors.filter(v => v.skipped).length;

  res.json({
    total: visitors.length,
    skippedCount,
    visitors
  });
});

module.exports = router;
