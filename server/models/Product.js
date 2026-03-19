import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  audience: String,
  tone: String,
  keywords: String,
  generatedContent: String
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;