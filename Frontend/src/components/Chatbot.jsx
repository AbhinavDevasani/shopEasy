import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoChatbubbleOutline } from "react-icons/io5";
function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! 👋 Welcome to NextBuy. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async (message = input) => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
    };

    // Keep the conversation history
    const updatedMessages = [...messages, userMessage];

    // Show user message immediately
    setMessages(updatedMessages);

    // Clear input
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/chat`,
        {
          message: message.trim(),
          history: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          response.data.reply ||
          "Sorry, I couldn't find a response for that.",
        products: response.data.products || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const botErrorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
        products: [],
      };

      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // =========================
  // VIEW PRODUCT
  // =========================

  const handleViewProduct = (product) => {
    const prodId = product.id || product._id;
    if (prodId) {
      navigate(`/product/${prodId}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* =====================================================
          CHAT WINDOW
      ===================================================== */}

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[560px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-sm:bottom-20 max-sm:right-3 max-sm:h-[70vh] max-sm:w-[calc(100%-24px)]">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex h-[70px] shrink-0 items-center justify-between bg-gray-900 px-4 text-white">

            <div className="flex items-center gap-3">

              {/* Bot Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
                🤖
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  NextBuy Assistant
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Online
                </div>
              </div>

            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl text-gray-300 transition hover:text-white"
              aria-label="Close chatbot"
            >
              ×
            </button>

          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">

            {messages.map((message) => (

              <div
                key={message.id}
                className={`flex flex-col ${
                  message.sender === "user"
                    ? "items-end"
                    : "items-start"
                }`}
              >

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-gray-900 text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  {message.text}
                </div>

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {message.products &&
                  message.products.length > 0 && (

                    <div className="mt-2 flex w-full gap-2 overflow-x-auto pb-1">

                      {message.products.map((product) => (

                        <div
                          key={product.id || product._id}
                          className="min-w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                        >

                          {/* Product Image */}

                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-28 w-full object-cover"
                          />

                          {/* Product Details */}

                          <div className="p-2.5">

                            <h4 className="truncate text-xs font-semibold text-gray-900">
                              {product.title}
                            </h4>

                            {/* Rating */}

                            <p className="mt-1 text-xs text-gray-500">
                              ⭐ {product.rating ?? 0}
                            </p>

                            {/* Price + View */}

                            <div className="mt-2 flex items-center justify-between">

                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-gray-900">
                                  ₹{product.price}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleViewProduct(product)
                                }
                                className="rounded-md bg-gray-900 px-2.5 py-1 text-[11px] text-white transition hover:bg-gray-700"
                              >
                                View
                              </button>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

              </div>

            ))}

            {/* =================================================
                TYPING INDICATOR
            ================================================= */}

            {isTyping && (

              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3 py-2.5">

                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"></span>

                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
                  style={{
                    animationDelay: "150ms",
                  }}
                ></span>

                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"
                  style={{
                    animationDelay: "300ms",
                  }}
                ></span>

              </div>

            )}

          </div>

          {/* =================================================
              QUICK SUGGESTIONS
          ================================================= */}

          <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-gray-200 bg-white px-3 py-2">

            <button
              onClick={() =>
                sendMessage("Show me products under ₹2000")
              }
              disabled={isTyping}
              className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1.5 text-[11px] text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              💰 Under ₹2000
            </button>

            <button
              onClick={() =>
                sendMessage("Recommend something for me")
              }
              disabled={isTyping}
              className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1.5 text-[11px] text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ⭐ Recommend
            </button>

            <button
              onClick={() =>
                sendMessage("Show me headphones")
              }
              disabled={isTyping}
              className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1.5 text-[11px] text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🎧 Headphones
            </button>

          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="flex h-[60px] shrink-0 gap-2 border-t border-gray-200 bg-white p-2.5"
          >

            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 text-sm outline-none transition focus:border-gray-900 disabled:bg-gray-100"
            />

            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ➤
            </button>

          </form>

        </div>
      )}

      {/* =====================================================
          FLOATING CHAT BUTTON
      ===================================================== */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-gray-800 max-sm:bottom-4 max-sm:right-4"
        aria-label="Open chatbot"
      >
        {isOpen ? "×" : <IoChatbubbleOutline /> }
      </button>
    </>
  );
}

export default Chatbot;