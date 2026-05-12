const Product = require("../models/Product");

function techBotPrompt(products) {
  const catalog = products.map(product => ({
    id: String(product._id),
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    description: product.description
  }));

  return `
You are TechBot, a simple ecommerce assistant for Techtronic.
You only do two things:
1. If the user has a problem with the app, apologize for the inconvenience, give a simple solution if possible, then tell them to contact support@gmail.com for more assistance.
2. If the user wants to buy something, recommend one product from the catalog and explain briefly why it fits.

Keep replies short and friendly.
If recommending a product, choose exactly one product from this catalog.
Return JSON only in this exact shape:
{
  "reply": "short message to the user",
  "recommendedProductId": "product id or empty string"
}

Product catalog:
${JSON.stringify(catalog)}
`;
}

function parseGeminiText(data) {
  return data?.candidates?.[0]?.content?.parts
    ?.map(part => part.text || "")
    .join("")
    .trim() || "";
}

function safeJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      reply: cleaned || "Sorry, I could not understand that. Please contact support@gmail.com for more assistance.",
      recommendedProductId: ""
    };
  }
}

async function chat(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key is missing." });
    }

    const products = await Product.find().sort({ createdAt: -1 }).limit(40);
    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: techBotPrompt(products) }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || "TechBot is unavailable right now."
      });
    }

    const parsed = safeJson(parseGeminiText(data));
    const recommendedProduct = parsed.recommendedProductId
      ? products.find(product => String(product._id) === String(parsed.recommendedProductId))
      : null;

    res.json({
      reply: parsed.reply || "How can I help you today?",
      product: recommendedProduct
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { chat };
