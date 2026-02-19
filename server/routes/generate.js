const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    // 3️⃣ Gemini AI Call
    // -----------------------------
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
    });

    const result = await model.generateContent(prompt);
    const aiContent = result.response.text();

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
      source: "gemini",
      data: aiContent,
    });

  } catch (error) {

    console.log("🔥 Gemini Error:", error.message);

    // -----------------------------
    // 🧠 SMART FALLBACK CONTENT
    // -----------------------------
    const fallbackContent = `
### 1. SEO Product Description
Discover the ultimate ${req.body.name}, crafted for ${req.body.audience}. 
This premium ${req.body.category} solution enhances your beauty routine with powerful natural ingredients. 
Designed with a ${req.body.tone} tone, it deeply nourishes and revitalizes your skin for a radiant glow. 
Perfect for modern consumers seeking ${req.body.keywords}, this product blends performance with purity.

### 2. SEO Titles
• Premium ${req.body.name} for Radiant Results
• Best ${req.body.category} for Modern Women
• Natural ${req.body.name} – Chemical-Free Formula
• Luxury ${req.body.category} Solution
• Advanced Skincare for Glowing Skin

### 3. Meta Description
Shop premium ${req.body.name} for glowing, healthy skin. Natural, effective & beautifully crafted.

### 4. Hashtags
#OrganicSkincare #GlowingSkin #CleanBeauty #LuxuryBeauty #NaturalCare
#HealthySkin #BeautyEssentials #RadiantGlow #PremiumSkincare #SelfCare

### 5. Keywords
${req.body.keywords}, organic beauty, skincare routine, radiant skin, premium moisturizer
`;

    return res.status(200).json({
      success: true,
      source: "fallback",
      data: fallbackContent,
    });
  }
});

module.exports = router;
