import { useEffect, useState, useCallback } from "react";
import { X, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader.jsx";
const DISCOUNT_PERCENTAGE = 25;

export default function CartDrawer({ open, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [cart, setCart] = useState({ items: [] });
  const token = Cookies.get("Jwt_token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //fetching the cart
  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/cart/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch cart");
      }

      setCart(data.cartProducts || data.cart || { items: [] });
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false); 
    }
  }, [token]);

  //opening the cart when user clicks on cart icon
  useEffect(() => {
    if (open && token) {
      fetchCart();
    }
  }, [open, token, fetchCart]);

  //adding an item
  const addItem = async (id) => {
    try {
      await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      fetchCart();
    } catch (error) {
      console.error("Add item error:", error);
    }
  };

  //decrease the item
  const decreaseItem = async (id) => {
    try {
      await fetch(`${API_URL}/cart/decrease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });

      fetchCart();
    } catch (error) {
      console.error("Decrease item error:", error);
    }
  };

  //remove the item
  const removeItemCompletely = async (id, quantity) => {
    try {
      for (let i = 0; i < quantity; i++) {
        await fetch(`${API_URL}/cart/decrease`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        });
      }

      fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  //clear the cart
  const clearCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to clear cart");
      }

      setCart({ items: [] });
    } catch (error) {
      console.error("Clear cart error:", error);
      alert(error.message);
    }
  };

  const calculateDiscountedPrice = (price) =>
    price - (price * DISCOUNT_PERCENTAGE) / 100;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">

      <div className="w-[420px] bg-white h-full p-6 overflow-y-auto relative">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>
        {loading && (
            <div className="w-full bg-white h-full p-6 overflow-y-auto relative">
                <Loader />
            </div>
        )}
        {!loading && cart.items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cart.items.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.product.price
            );

            return (
              <div
                key={item.product._id}
                className="flex gap-4 border-b pb-4 mb-4"
              >
                <img
                  src={item.product.image}
                  className="w-20 h-24 object-cover rounded"
                  alt={item.product.title}
                />

                <div className="flex-1">
                  <h4 className="font-semibold">{item.product.title}</h4>
                  <p className="text-blue-600 font-bold">
                    ₹{discountedPrice.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseItem(item.product._id)}
                      className="border px-2 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addItem(item.product._id)}
                      className="border px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeItemCompletely(item.product._id, item.quantity)
                  }
                  className="text-gray-400 "
                >
                  <Trash2 />
                </button>
              </div>
            );
          })
        )}

        <button
          onClick={() => {
            onClose();
            navigate("/checkout");
          }}
          className="w-full mt-4 bg-[#000000] text-white py-3 rounded"
        >
          Proceed to Checkout
        </button>

        <div className="flex gap-4 mt-3">
          <button
            onClick={() => {
              onClose();
              navigate("/shop");
            }}
            className="flex-1 border text-center py-2 rounded "
          >
            Continue Shopping
          </button>
          <button
            onClick={clearCart}
            className="flex-1 border py-2 rounded"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
