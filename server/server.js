import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import generateRoute from "./routes/generate.js";

dotenv.config();

const app = express();

// -----------------------------
// 🔹 Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// 🔹 Health Check Route (IMPORTANT 🔥)
// -----------------------------
app.get("/", (req, res) => {
  res.send("🚀 AI Product SEO Toolkit API is running...");
});

// -----------------------------
// 🔹 API Routes
// -----------------------------
app.use("/api/generate", generateRoute);

// -----------------------------
// 🔹 MongoDB Connection
// -----------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // exit if DB fails
  }
};

connectDB();

// -----------------------------
// 🔹 Server Start
// -----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});