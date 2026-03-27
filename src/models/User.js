const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true },
    email: String,
    role: { type: String, default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", schema);