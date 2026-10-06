import { searchProducts } from "../services/productSearch.js";
import {
  understandUserIntent,
  generateShoppingResponse,
} from "../services/aiService.js";

const chatController = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // -----------------------------
    // 1. Validate request
    // -----------------------------
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Clean history (keep last 6 turns, only sender and text)
    const cleanHistory = Array.isArray(history)
      ? history.slice(-6).map((h) => ({
          sender: h.sender || h.role || "user",
          text: h.text || h.content || "",
        }))
      : [];

    const lowerMsg = message.trim().toLowerCase();
    const greetings = [
      "hi",
      "hello",
      "hey",
      "hi there",
      "hello there",
      "good morning",
      "good afternoon",
      "good evening",
      "namaste",
      "hlo",
      "hey there",
    ];

    // Explicit check for simple greetings
    if (greetings.includes(lowerMsg)) {
      return res.status(200).json({
        success: true,
        intent: "greeting",
        reply: "Hello! 👋 Welcome to NextBuy. How can I help you today?",
        products: [],
        action: null,
      });
    }

    // -----------------------------
    // 2. Understand user message
    // -----------------------------
    let intent;
    try {
      intent = await understandUserIntent({
        message,
        history: cleanHistory,
      });
    } catch (err) {
      console.error("Intent understanding failed:", err);
      intent = { intent: "unknown" };
    }

    // If intent is greeting, return simple greeting response without searching products
    if (intent.intent === "greeting") {
      const reply = await generateShoppingResponse({
        message,
        history: cleanHistory,
        products: [],
      });
      return res.status(200).json({
        success: true,
        intent: "greeting",
        reply: reply || "Hello! 👋 Welcome to NextBuy. How can I help you today?",
        products: [],
        action: null,
      });
    }

    // -----------------------------
    // 3. Handle product search & recommendations
    // Only search products if explicitly requested or filters are present!
    // -----------------------------
    const hasSearchFilters =
      intent.category ||
      (intent.minPrice !== null && intent.minPrice !== undefined) ||
      (intent.maxPrice !== null && intent.maxPrice !== undefined) ||
      (intent.search && intent.search.trim() !== "") ||
      intent.sortBy;

    const isExplicitSearchIntent =
      intent.intent === "search_products" ||
      intent.intent === "recommend_products" ||
      intent.intent === "product_details" ||
      intent.intent === "compare_products";

    if (isExplicitSearchIntent || hasSearchFilters) {
      let products = [];
      try {
        products = await searchProducts({
          category: intent.category,
          minPrice: intent.minPrice,
          maxPrice: intent.maxPrice,
          search: intent.search,
          sortBy: intent.sortBy,
        });
      } catch (err) {
        console.error("Error searching products:", err);
      }

      const productData = products.map((product) => {
        const originalPrice = product.price;
        const discountedPrice = Number((originalPrice * 0.75).toFixed(2));
        return {
          id: product._id ? product._id.toString() : product.id,
          _id: product._id ? product._id.toString() : product.id,
          title: product.title,
          price: discountedPrice,
          originalPrice: originalPrice,
          category: product.category,
          description: product.description,
          image: product.image,
          rating: product.rating,
          numReviews: product.numReviews,
        };
      });

      if (productData.length === 0) {
        return res.status(200).json({
          success: true,
          intent: intent.intent,
          reply: "Sorry, I couldn't find any products matching your request.",
          products: [],
          action: null,
        });
      }

      let reply = "";
      try {
        reply = await generateShoppingResponse({
          message,
          history: cleanHistory,
          products: productData,
        });
      } catch (err) {
        console.error("AI response generation error:", err);
        reply = intent.maxPrice
          ? `The products under ₹${intent.maxPrice} are:`
          : "The products matching your search are:";
      }

      return res.status(200).json({
        success: true,
        intent: intent.intent,
        reply,
        products: productData,
        action: null,
      });
    }

    // -----------------------------
    // 4. Non-search intent (general questions / conversational chat)
    // -----------------------------
    const reply = await generateShoppingResponse({
      message,
      history: cleanHistory,
      products: [],
    });

    return res.status(200).json({
      success: true,
      intent: intent.intent || "unknown",
      reply,
      products: [],
      action: null,
    });

  } catch (error) {
    console.error("Chat controller error:", error);

    return res.status(200).json({
      success: true,
      reply: "Hello! 👋 Welcome to NextBuy. How can I help you today?",
      products: [],
    });
  }
};

export default chatController;