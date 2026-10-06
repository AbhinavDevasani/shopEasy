import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export const understandUserIntent = async ({ message, history = [] }) => {
  const cleanHistory = history.map((h) => ({
    sender: h.sender || h.role || "user",
    text: h.text || h.content || "",
  }));

  const lowerMsg = message.trim().toLowerCase();
  const greetings = ["hi", "hello", "hey", "hi there", "hello there", "good morning", "good afternoon", "good evening", "namaste", "hlo", "hey there"];
  if (greetings.includes(lowerMsg)) {
    return {
      intent: "greeting",
      category: null,
      minPrice: null,
      maxPrice: null,
      search: null,
      sortBy: null,
    };
  }

  const prompt = `
You are an AI shopping assistant for NextBuy store.

Understand the user's shopping request and return ONLY valid JSON.

Allowed intents:
- greeting (e.g. "hi", "hello", "hey", "how are you")
- search_products (e.g. "show me shoes", "products under 2000", "find jeans")
- recommend_products (e.g. "recommend something", "best laptops")
- product_details (e.g. "tell me more about this blender")
- compare_products (e.g. "compare phone A and phone B")
- add_to_cart (e.g. "add to cart")
- unknown (general questions, store policies, chit-chat)

Return exactly this structure:

{
  "intent": "search_products",
  "category": null,
  "minPrice": null,
  "maxPrice": null,
  "search": null,
  "sortBy": null
}

Rules:
- Greetings like "hi", "hello", "hey" → intent: "greeting".
- "under", "below", "less than" → maxPrice
- "above", "over", "more than" → minPrice
- "between X and Y" → minPrice and maxPrice
- "cheapest" → price_asc
- "most expensive" → price_desc
- "best rated", "highest rated" → rating_desc
- Extract numerical values for minPrice and maxPrice (e.g., 2000, not "2000" or "₹2000").
- Allowed categories in store: "Electronics", "Fashion & Apparel", "Home & Kitchen", "Beauty & Personal Care", "Sports & Fitness".
- If the user specifies one of these exact store categories, set "category" to that exact string.
- If the user asks for specific product keywords or item names (e.g. "running shoes", "blender", "leather jacket", "earbuds", "jeans"), put them in "search", NOT "category".
- Use null when information is not specified.

Previous conversation:
${JSON.stringify(cleanHistory)}

Current user message:
${message}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text);

    if (parsed.minPrice !== null && parsed.minPrice !== undefined) {
      const num = Number(parsed.minPrice);
      parsed.minPrice = isNaN(num) ? null : num;
    }
    if (parsed.maxPrice !== null && parsed.maxPrice !== undefined) {
      const num = Number(parsed.maxPrice);
      parsed.maxPrice = isNaN(num) ? null : num;
    }

    return parsed;
  } catch (error) {
    console.error("Gemini JSON parsing / intent error:", error);

    return {
      intent: "unknown",
      category: null,
      minPrice: null,
      maxPrice: null,
      search: null,
      sortBy: null,
    };
  }
};

export const generateShoppingResponse = async ({
  message,
  history = [],
  products = [],
}) => {
  const cleanHistory = history.map((h) => ({
    sender: h.sender || h.role || "user",
    text: h.text || h.content || "",
  }));

  if (products && products.length > 0) {
    const prompt = `
You are a helpful AI shopping assistant for NextBuy.

CRITICAL FORMATTING RULES:
1. The user explicitly searched for products and matching products were found.
2. The UI will display interactive product cards directly below your message.
3. Your response MUST ONLY be a single, short introductory line ending with a colon.
4. Examples of exact desired output format:
   - "The products under ₹2000 are:"
   - "Here are the products matching your search:"
   - "Here are the top recommended products for you:"
5. ABSOLUTELY DO NOT list any product titles, prices, descriptions, bullet points, numbers, or markdown lists in your message. NEVER include lines like "* T-Shirt: ₹200".

User query: "${message}"
`;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      let text = response.text ? response.text.trim() : "";

      if (text.includes("\n")) {
        text = text.split("\n")[0].trim();
      }

      text = text.replace(/[\*\-\#]+/g, "").trim();

      if (!text) {
        text = "Here are the products matching your search:";
      }

      return text;
    } catch (error) {
      console.error("Gemini response generation error:", error);
      return "Here are the products matching your request:";
    }
  }

  // When no products exist or for general/greeting queries
  const prompt = `
You are a friendly, helpful AI shopping assistant for NextBuy store.

Instructions:
- If the user greets you or says "hi"/"hello", respond warmly welcoming them to NextBuy (e.g. "Hello! 👋 Welcome to NextBuy. How can I help you today?").
- DO NOT mention product search results or say "here are your products" unless products are actually being searched.
- Answer any general questions politely and concisely in 1-2 sentences.

Previous conversation:
${JSON.stringify(cleanHistory)}

User message:
${message}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text ? response.text.trim() : "Hello! 👋 Welcome to NextBuy. How can I help you today?";
  } catch (error) {
    console.error("Gemini general response error:", error);
    return "Hello! 👋 Welcome to NextBuy. How can I help you today?";
  }
};