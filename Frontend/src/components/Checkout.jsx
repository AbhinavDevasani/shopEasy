import { useState, useEffect } from "react";
import {
  ShoppingCart,
  CreditCard,
  Lock,
  Truck,
  RefreshCw,
  Shield,
  Check,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const token = Cookies.get("Jwt_token");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setItems([]);
        setLoadingCart(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart/getCart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const cartItems = data.cart?.items || data.cartProducts?.items || [];

        setItems(
          cartItems.map((i) => ({
            _id: i.product._id,
            title: i.product.title,
            price: i.product.price,
            image: i.product.image,
            quantity: i.quantity,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [token, API_URL]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading your cart...
      </div>
    );
  }

  const DISCOUNT_PERCENT = 25;
  const TAX_RATE = 0.1;
  const SHIPPING_FEE = items.length > 0 ? 50 : 0;

  const discountedPrice = (price) =>
    price - (price * DISCOUNT_PERCENT) / 100;

  const subtotal = items.reduce(
    (sum, item) =>
      sum + discountedPrice(item.price) * item.quantity,
    0
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_FEE;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "country",
    ];

    const newErrors = {};
    required.forEach((f) => {
      if (!formData[f]) newErrors[f] = true;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required details");
      return;
    }

    setIsProcessing(true);

    try {
      const shippingInfo = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
      };

      const orderRes = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shippingInfo,
          pricing: { subtotal, tax, shipping: SHIPPING_FEE, total },
          paymentMethod,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully!");
        setTimeout(() => navigate("/profile"), 1500);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payment/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            

            if (!verifyRes.ok) {
              toast.error("Payment verification failed");
              return;
            }

            toast.success("Payment successful! Order confirmed");
            setTimeout(() => navigate("/profile"), 1500);
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to process order");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-gray-500">Complete your purchase securely</p>
            </div>
          </div>

          <div className="flex gap-2 max-w-xl">
            {["Cart", "Checkout", "Payment", "Done"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${i < 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {i === 0 ? <Check size={16} /> : i + 1}
                </div>
                <span className="hidden sm:inline text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={`w-full mt-1 px-4 py-2 border rounded-lg ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                >
                  <option value="">Select</option>
                  <option>India</option>
                  <option>USA</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

            {["card", "upi", "cod"].map((m) => (
              <label
                key={m}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer mb-3
                ${paymentMethod === m ? "border-black bg-gray-100" : ""}`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                {m === "card" && <CreditCard />}
                {m === "upi" && <span>₹</span>}
                {m === "cod" && <Truck />}
                <span className="capitalize">{m === "card" ? "Card" : m === "upi" ? "UPI" : "Cash on Delivery"}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          {items.map((item) => {
            const finalPrice = discountedPrice(item.price);
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 mb-4 border-b pb-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <div className="flex gap-2 text-sm items-center">
                    <span className="line-through text-gray-400">
                      ₹{item.price}
                    </span>
                    <span className="font-semibold">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-green-600">
                      (25% OFF)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="space-y-2 text-sm mt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{SHIPPING_FEE}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg my-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-black text-white py-3 rounded-lg flex justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock size={16} /> {isProcessing ? "Processing..." : "Place Order"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-3 flex justify-center gap-1">
            <Shield size={12} /> Secure payment
          </p>
        </div>
      </div>

      <footer className="border-t bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <RefreshCw className="mx-auto mb-2" />
            Free Returns
          </div>
          <div>
            <Lock className="mx-auto mb-2" />
            Secure Checkout
          </div>
          <div>
            <Truck className="mx-auto mb-2" />
            Fast Delivery
          </div>
        </div>
      </footer>
    </div>
  );
}
