import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import ImageMagnifier from "./Zoom.jsx";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loader from "./Loader.jsx";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const originalPrice = Number(product?.price) || 0;
  const API_URL = import.meta.env.VITE_API_URL;
  const discountPercentage = 25;
  const discountedPrice = (
    originalPrice -
    (originalPrice * discountPercentage) / 100
  ).toFixed(2);
  const goBack = () => navigate(-1);
  const [isWishlisted, setIsWishlisted] = useState(false)
  const token = Cookies.get("Jwt_token");
  const getStarFill = (rating, starIndex) => {
    const full = starIndex + 1 <= rating;
    const partial = rating > starIndex && rating < starIndex + 1;
    if (full) return "100%";
    if (partial) return `${(rating - starIndex) * 100}%`;
    return "0%";
  };

  const checkWishlistStatus = useCallback(async (productId) => {
  if (!token) {
    setIsWishlisted(false);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/wishlist/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    const exists = data?.wishlist?.items?.some(
      (item) => item.product._id === productId
    );

    setIsWishlisted(Boolean(exists));
  } catch (err) {
    console.error("Wishlist check failed", err);
    setIsWishlisted(false);
  }
}, [token]);

const checkCartStatus = useCallback(async (productId) => {
  if (!token) {
    setIsInCart(false);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart/getCart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const items =
      data.cart?.items ||
      data.cartProducts?.items ||
      [];

    const exists = items.some(
      (item) => item.product._id === productId
    );

    setIsInCart(exists);
  } catch (err) {
    console.error("Cart check failed", err);
    setIsInCart(false);
  }
}, [token]);


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_URL}/product/products/getProductById/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load product");
        }

        setProduct(data.product);
        setReviews(data.product.reviews || []);
        checkWishlistStatus(data.product._id);
        checkCartStatus(data.product._id); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, checkWishlistStatus, checkCartStatus]);

  
  const handleCartToggle = async () => {
  if (!token) {
    toast.error("Please login to manage cart");
    return;
  }

  try {
    setCartLoading(true);

    const url = isInCart
      ? `${API_URL}/cart/remove/${product._id}`
      : `${API_URL}/cart/add`;

    const res = await fetch(url, {
      method: isInCart ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: !isInCart
        ? JSON.stringify({ productId: product._id })
        : null,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setIsInCart(!isInCart);

    toast.success(
      isInCart
        ? "Removed from cart"
        : "Added to cart"
    );
  } catch (err) {
    toast.error(err.message || "Cart action failed");
  } finally {
    setCartLoading(false);
  }
};

 
  const handleSubmitReview = async () => {
  if (!Cookies.get("Jwt_token")) {
    setReviewError("Please login to submit a review");
    return;
  }

  if (!reviewRating || !reviewComment.trim()) {
    setReviewError("Rating and review are required");
    return;
  }

  try {
    setReviewLoading(true);
    setReviewError("");

    const res = await fetch(
      `${API_URL}/product/products/${id}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("Jwt_token")}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment
        })
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to add review");
    }

    
    setReviews(data.reviews);

    setShowReviewForm(false);
    setReviewRating(0);
    setReviewComment("");
  } catch (err) {
    setReviewError(err.message);
  } finally {
    setReviewLoading(false);
  }
};

const handleWishlistToggle = async () => {
  if (!token) {
    toast.error("Please login to manage wishlist");
    return;
  }

  try {
    const url = isWishlisted
      ? `${API_URL}/wishlist/remove/${product._id}`
      : `${API_URL}/wishlist/`;

    const res = await fetch(url, {
      method: isWishlisted ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: !isWishlisted
        ? JSON.stringify({ productId: product._id })
        : null,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setIsWishlisted(!isWishlisted);

    toast.success(
      isWishlisted
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  } catch (err) {
    toast.error(err.message || "Wishlist failed");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      
      <button
        onClick={goBack}
        className="px-4 py-2 ml-10 mt-6 bg-black text-white rounded-md"
      >
        ← Back
      </button>

      <section className="px-6 py-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <ImageMagnifier
          src={product.image}
          alt={product.title}
          zoom={2.5}
          lensSize={180}
        />

        <div className="space-y-6">
          <span className="text-sm uppercase bg-gray-100 px-3 py-1 rounded-full">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            
            {[0, 1, 2, 3, 4].map((star) => (
              <div key={star} className="relative w-6 h-6">
                <Star className="text-gray-300 absolute" />
                <div
                  className="absolute overflow-hidden"
                  style={{ width: getStarFill(product.rating || 0, star) }}
                >
                  
                  <Star className="fill-yellow-500 text-yellow-500" />
                </div>
              </div>

            ))}
            <span>{product.rating.toFixed(2)}</span>
            <span className="text-sm text-gray-500">
              ({product.numReviews || 0} reviews)
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-3xl font-bold">₹{discountedPrice}</span>
            <span className="line-through text-gray-400">
              ₹{originalPrice}
            </span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex gap-4">
            <button
              onClick={handleCartToggle}
              disabled={cartLoading || isInCart}
              className={`flex-1 py-3 rounded-md text-white
                ${isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-black cursor-pointer"}
              `}
            >
              <ShoppingCart className="inline mr-2" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>



            <button
              onClick={handleWishlistToggle}
              className={`flex-1 border py-3 rounded-md flex items-center justify-center gap-2
                ${isWishlisted ? "text-red-600 border-red-500" : ""}`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-black text-white px-5 py-2 rounded-md"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="border p-6 rounded-lg mb-10">
            {reviewError && (
              <p className="text-red-500 text-sm mb-3">{reviewError}</p>
            )}

            <div className="mb-4">
              <p className="mb-2 font-medium">Rating</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((r) => (
                  <label key={r} className="cursor-pointer flex items-center">
                    <input
                      type="radio"
                      checked={reviewRating === r}
                      onChange={() => setReviewRating(r)}
                      className="mr-1"
                    />
                    <span>{r}</span>
                    <Star className="fill-yellow-500 text-yellow-500 w-4 h-4" />
                  </label>
                ))}
              </div>
            </div>

            <textarea
              rows="4"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border p-3 rounded-md mb-4"
              placeholder="Write your review..."
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="bg-black text-white px-6 py-2 rounded-md"
              >
                {reviewLoading ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="border px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {reviews.length === 0 && !showReviewForm ? (
          <div className="text-center py-12 border-dashed border rounded-lg">
            <p className="text-lg text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400">
              Be the first to review this product
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border p-5 rounded-lg flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl font-bold uppercase">
                  {review.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-lg">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{review.rating}</span>
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductDetail;
