import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export const understandUserIntent = async ({ message, history = [] }) => {
  const prompt = `
You are an AI shopping assistant.

Understand the user's shopping request and return ONLY valid JSON.

Allowed intents:
- search_products
- recommend_products
- product_details
- compare_products
- add_to_cart
- unknown

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
- "under", "below", "less than" → maxPrice
- "above", "over", "more than" → minPrice
- "between X and Y" → minPrice and maxPrice
- "cheapest" → price_asc
- "most expensive" → price_desc
- "best rated", "highest rated" → rating_desc
- Extract useful product/category search terms.
- Use null when information is not specified.

Previous conversation:
${JSON.stringify(history)}

Current user message:
${message}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini JSON parsing error:", response.text);

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
  const prompt = `
You are a helpful AI shopping assistant.

Answer the user's question using ONLY the product information provided below.

Never invent:
- products
- prices
- ratings
- specifications
- reviews
- discounts

If no products were found, clearly tell the user that no matching products were found.

Keep the response concise and natural.

IMPORTANT PRICE RULES:
- Prices come directly from the database.
- Display the price using the ₹ symbol.
- Do NOT convert or change the numeric price.
- For example, 49.99 must be displayed as ₹49.99.
- Never use the $ symbol.

IMPORTANT PRODUCT RULES:
- Only mention products present in the Products data below.
- Never create or assume a product that is not provided.
- Never change a product's price or rating.

Products:
${JSON.stringify(products)}

Previous conversation:
${JSON.stringify(history)}

User:
${message}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};