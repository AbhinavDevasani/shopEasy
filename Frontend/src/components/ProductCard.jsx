import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function ProductCard({ product, showRemove = false, onRemove }) {
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("Jwt_token");
  const API_URL = import.meta.env.VITE_API_URL;
  const discountPercentage = 25;
  const discountedPrice = (
    product.price -(product.price * discountPercentage) / 100
  ).toFixed(2);


  
  const checkProductInCart = useCallback(async () => {
    if (!token || !product?._id) return;

    try {
      const res = await fetch(`${API_URL}/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const items = data.cart?.items || data.cartProducts?.items || [];
      setIsAdded(items.some((i) => i.product._id === product._id));
    } catch (err) {
      console.error(err);
    }
  }, [token, product?._id]);

  useEffect(() => {
    checkProductInCart();
  }, [checkProductInCart]);

  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) throw new Error();
      toast.success("Product added to cart");
      setIsAdded(true);
    } catch {
      toast.error("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(product._id);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="w-[25%] h-[25%] rounded-lg z-10 shadow-2xl"
    >
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-md">

        
        <div className="relative aspect-square bg-gray-50 overflow-hidden group">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        
        <div className="p-4">
          <h3 className="font-semibold text-[#1E293B] mb-2 line-clamp-2 text-sm">
            {product.title}
          </h3>

          <p className="text-xs text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-black">
                    ₹{discountedPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                    ₹{product.price}
                </span>
            </div>


            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={loading || isAdded}
                className="flex items-center gap-1 bg-black hover:bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md disabled:opacity-60"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAdded ? "Added" : loading ? "Adding..." : "Add"}
              </button>

              
              {showRemove && (
                <button
                    onClick={handleRemove}
                    className="text-xs px-3 py-1.5 rounded-md border border-red-500 text-red-600 hover:bg-red-50 transition"
                >
                    Remove from Wishlist
                </button>
                )}

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
