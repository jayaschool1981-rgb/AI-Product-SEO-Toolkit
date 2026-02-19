import { useState } from "react";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    audience: "",
    tone: "",
    keywords: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResult("");

      const res = await axios.post(
        "https://ai-product-seo-toolkit.onrender.com/api/generate",
        form
      );

      setResult(res.data.data);
    } catch (err) {
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Product SEO Generator 🚀
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Generate powerful SEO descriptions, titles & hashtags instantly.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10">

          <div className="grid md:grid-cols-2 gap-6">

            {[
              { label: "Product Name", name: "name", placeholder: "Organic Face Cream" },
              { label: "Category", name: "category", placeholder: "Beauty & Skincare" },
              { label: "Target Audience", name: "audience", placeholder: "Women aged 18-35" },
              { label: "Brand Tone", name: "tone", placeholder: "Elegant & Premium" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-gray-300 mb-2">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>
            ))}

          </div>

          {/* KEYWORDS */}
          <div className="mt-6">
            <label className="block text-sm text-gray-300 mb-2">
              SEO Keywords
            </label>
            <textarea
              name="keywords"
              rows="3"
              value={form.keywords}
              onChange={handleChange}
              placeholder="organic face cream, glowing skin..."
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 outline-none transition"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:scale-105 transform transition duration-300"
          >
            {loading ? "⚡ Generating..." : "✨ Generate AI Content"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="mt-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Generated Content
              </h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="bg-green-500 px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
              >
                Copy
              </button>
            </div>

            <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
              {result}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
