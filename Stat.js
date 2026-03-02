const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  website: { type: String, required: true },
  timeSpent: { type: Number, default: 0 },
  category: { type: String, required: true }
});

module.exports = mongoose.model("Stat", statSchema);