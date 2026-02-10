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

  const subtotal = cart.items.reduce((total, item) => {
    return total + calculateDiscountedPrice(item.product.price) * item.quantity;
  }, 0);

  return (
    <div
      className={`relative z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-labelledby="drawer-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-black/75 transition-opacity duration-500 ease-in-out ${open ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className={`fixed inset-0 overflow-hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div
              className={`pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="drawer-title">Shopping cart</h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="size-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {loading ? (
                        <div className="flex justify-center items-center h-40">
                          <Loader />
                        </div>
                      ) : cart.items.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">Your cart is empty</p>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cart.items.map((item) => {
                            const discountedPrice = calculateDiscountedPrice(item.product.price);
                            return (
                              <li key={item.product._id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.title}
                                    className="size-full object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href="#">{item.product.title}</a>
                                      </h3>
                                      <p className="ml-4">₹{discountedPrice.toFixed(2)}</p>
                                    </div>
                                    {/* <p className="mt-1 text-sm text-gray-500">Color</p> */}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                      <p>Qty {item.quantity}</p>
                                      <div className="flex items-center border rounded ml-2 p-1">
                                        <button
                                          onClick={() => decreaseItem(item.product._id)}
                                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 border-r-2"
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={() => addItem(item.product._id)}
                                          className="px-2 py-0.5 hover:bg-gray-100 text-gray-600"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeItemCompletely(item.product._id, item.quantity)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        onClose();
                        navigate("/checkout");
                      }}
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate("/shop");
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                  {cart.items.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 underline">
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
