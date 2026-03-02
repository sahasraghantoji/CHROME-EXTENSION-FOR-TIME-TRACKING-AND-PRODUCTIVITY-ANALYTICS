const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Stat = require("./models/Stat");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/productivityDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const productiveSites = [
  "github.com",
  "leetcode.com",
  "hackerrank.com",
  "stackoverflow.com"
];

app.post("/api/track", async (req, res) => {
  try {
    const { website, timeSpent } = req.body;

    if (!website || !timeSpent) {
      return res.status(400).json({ error: "Invalid Data" });
    }

    const category = productiveSites.includes(website)
      ? "Productive"
      : "Unproductive";

    let record = await Stat.findOne({ website });

    if (record) {
      record.timeSpent += timeSpent;
      await record.save();
    } else {
      await Stat.create({ website, timeSpent, category });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/stats", async (req, res) => {
  const data = await Stat.find();
  res.json(data);
});

app.use("/dashboard", express.static(path.join(__dirname, "../dashboard")));

app.listen(5000, () => console.log("Server running at http://localhost:5000"));