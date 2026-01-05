const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  name: String,
  skipped: Boolean,
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Visitor", VisitorSchema);
