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
  const API_URL = import.meta.env.VITE_API_URL;
  const token = Cookies.get("Jwt_token");

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
  const [isWishlisted, setIsWishlisted] = useState(false);

  const originalPrice = Number(product?.price) || 0;
  const discountPercentage = 25;
  const discountedPrice = (
    originalPrice -
    (originalPrice * discountPercentage) / 100
  ).toFixed(2);

  /* ---------------- STAR FILL ---------------- */
  const getStarFill = (rating, starIndex) => {
    if (starIndex + 1 <= rating) return "100%";
    if (rating > starIndex) return `${(rating - starIndex) * 100}%`;
    return "0%";
  };

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_URL}/product/products/getProductById/${id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProduct(data.product);
        setReviews(data.product.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  /* ---------------- CART ---------------- */
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
      toast.success(isInCart ? "Removed from cart" : "Added to cart");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCartLoading(false);
    }
  };

  /* ---------------- WISHLIST ---------------- */
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
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------------- REVIEW STATS ---------------- */
  const totalReviews = reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  const ratingPercentages = ratingCounts.map((count) =>
    totalReviews ? Math.round((count / totalReviews) * 100) : 0
  );

  const averageRating = totalReviews
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      ).toFixed(1)
    : 0;

  /* ---------------- SUBMIT REVIEW ---------------- */
  const handleSubmitReview = async () => {
    if (!token) {
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            comment: reviewComment,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
    <main className="bg-white min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 ml-10 mt-6 bg-black text-white rounded-md"
      >
        ← Back
      </button>

      {/* PRODUCT SECTION (UNCHANGED) */}
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

          {/* STARS */}
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((star) => (
              <div key={star} className="relative w-6 h-6">
                <Star className="text-gray-300 absolute" />
                <div
                  className="absolute overflow-hidden"
                  style={{ width: getStarFill(product.rating || 0, star) }}
                >
                  <Star className="fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            ))}
            <span className="text-sm text-gray-500">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* PRICE */}
          <div className="flex gap-3 items-center">
            <span className="text-3xl font-bold">₹{discountedPrice}</span>
            <span className="line-through text-gray-400">
              ₹{originalPrice}
            </span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* CART + WISHLIST */}
          <div className="flex gap-4">
            <button
              onClick={handleCartToggle}
              disabled={cartLoading || isInCart}
              className={`flex-1 py-3 rounded-md text-white ${
                isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black"
              }`}
            >
              <ShoppingCart className="inline mr-2" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`flex-1 border py-3 rounded-md flex items-center justify-center gap-2 ${
                isWishlisted ? "text-red-600 border-red-500" : ""
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
              />
              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION (UPDATED) */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* LEFT */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600">
                Based on {totalReviews} reviews
              </span>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-6">{star}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${ratingPercentages[index]}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm text-gray-600">
                    {ratingPercentages[index]}%
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full border py-3 rounded-md hover:bg-gray-50"
            >
              Write a review
            </button>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 space-y-8">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW MODAL */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowReviewForm(false)}
          />
          <div className="relative bg-white w-full max-w-lg mx-4 rounded-lg p-6 z-10">
            <h3 className="text-2xl font-bold mb-4">
              Write a Review
            </h3>

            {reviewError && (
              <p className="text-red-500 text-sm mb-3">
                {reviewError}
              </p>
            )}

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((r) => (
                <Star
                  key={r}
                  onClick={() => setReviewRating(r)}
                  className={`w-7 h-7 cursor-pointer ${
                    r <= reviewRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              rows="4"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border p-3 rounded-md mb-4"
              placeholder="Share your experience..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className="bg-black text-white px-6 py-2 rounded-md"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetail;
