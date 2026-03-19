import express from "express";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, category, audience, tone, keywords } = req.body;

    // -----------------------------
    // 1️⃣ Validation
    // -----------------------------
    if (!name || !category || !audience || !tone || !keywords) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // -----------------------------
    // 2️⃣ Build Prompt
    // -----------------------------
    const prompt = `
Act as an expert e-commerce copywriter.

Generate clearly separated sections:

1. SEO Product Description (150 words)
2. 5 SEO Titles
3. Meta Description (150 characters)
4. 10 Hashtags
5. Short-tail & Long-tail Keywords

Product Name: ${name}
Category: ${category}
Target Audience: ${audience}
Tone: ${tone}
SEO Keywords: ${keywords}
`;

    // -----------------------------
    // 3️⃣ OpenRouter API Call
    // -----------------------------
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiContent = response.data.choices[0].message.content;

    // -----------------------------
    // 4️⃣ Save To MongoDB
    // -----------------------------
    await Product.create({
      name,
      category,
      audience,
      tone,
      keywords,
      generatedContent: aiContent,
    });

    return res.status(200).json({
      success: true,
      source: "openrouter",
      data: aiContent,
    });

  } catch (error) {
    console.log("🔥 OpenRouter Error:", error.message);

    // -----------------------------
    // 🧠 SMART FALLBACK CONTENT
    // -----------------------------
    const fallbackContent = `
### 1. SEO Product Description
Discover the ultimate ${req.body.name}, crafted for ${req.body.audience}. 
This premium ${req.body.category} solution enhances your experience with powerful features. 
Designed with a ${req.body.tone} tone, it delivers exceptional results. 
Perfect for users seeking ${req.body.keywords}, this product blends performance with quality.

### 2. SEO Titles
• Premium ${req.body.name} for Best Results
• Best ${req.body.category} for Modern Users
• Top ${req.body.name} – High Performance
• Advanced ${req.body.category} Solution
• ${req.body.name} for Professionals

### 3. Meta Description
Buy ${req.body.name} for top performance and quality. Perfect for modern needs.

### 4. Hashtags
#BestProduct #TopQuality #TrendingNow #MustHave #Premium
#SmartChoice #Innovation #ModernLife #HighPerformance #Value

### 5. Keywords
${req.body.keywords}, premium product, best quality, trending product
`;

    return res.status(200).json({
      success: true,
      source: "fallback",
      data: fallbackContent,
    });
  }
});

export default router;