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

    // -----------------------------
    // 2. Understand user message
    // -----------------------------

    const intent = await understandUserIntent({
      message,
      history,
    });

    console.log("Chatbot intent:", intent);

    // -----------------------------
    // 3. Handle product search
    // -----------------------------

    if (
      intent.intent === "search_products" ||
      intent.intent === "recommend_products"
    ) {
      const products = await searchProducts({
        category: intent.category,
        minPrice: intent.minPrice,
        maxPrice: intent.maxPrice,
        search: intent.search,
        sortBy: intent.sortBy,
      });

      // Send only the required product information
      // to the AI
      const productData = products.map((product) => ({
        id: product._id.toString(),
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        rating: product.rating,
        numReviews: product.numReviews,
      }));

      // -----------------------------
      // 4. Generate AI response
      // -----------------------------

      const reply = await generateShoppingResponse({
        message,
        history,
        products: productData,
      });

      return res.status(200).json({
        success: true,
        intent: intent.intent,
        reply,
        products: productData,
        action: null,
      });
    }

    // -----------------------------
    // 5. Unknown intent
    // -----------------------------

    const reply = await generateShoppingResponse({
      message,
      history,
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

    return res.status(500).json({
      success: false,
      message: "Something went wrong with the chatbot",
    });
  }
};

export default chatController