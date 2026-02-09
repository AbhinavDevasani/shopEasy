import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ProductCard from "./ProductCard";
import { HeartCrack, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const token = Cookies.get("Jwt_token");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch(`${API_URL}/wishlist/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWishlistItems(data.wishlist?.items || []);
      setLoading(false);
    };
    fetchWishlist();
  }, [token]);

  const removeFromWishlist = async (productId) => {
    await fetch(`${API_URL}/wishlist/remove/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlistItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading wishlist...
      </div>
    );
  }


  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-2xl ">

          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100">
            <HeartCrack className="w-12 h-12 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mb-6">
            Save your favorite products here and come back anytime to buy them.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            <Package className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-6 m-6">
      <div>
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            My Wishlist <span className="text-red-500">❤️</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Turn your wishlist into reality — buy it today!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 m-2">
        {wishlistItems.map(({ product }) => (
          <ProductCard
            key={product._id}
            product={product}
            showRemove
            onRemove={removeFromWishlist}
          />
        ))}
      </div>

    </div>
  );
}
