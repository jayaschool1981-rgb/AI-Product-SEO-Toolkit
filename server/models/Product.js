const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  audience: String,
  tone: String,
  keywords: String,
  generatedContent: Object,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
