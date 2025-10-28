import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import BuyerNavbar from "../../components/BuyerNavbar";

export default function BuyerProduct() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [hover, setHover] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);


  const navigate = useNavigate();

  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/buyer/get-product/${id}`,
        { withCredentials: true }
      );
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add-item/${productId}`,
        null,
        {
          params: { quantity: 1 },
          withCredentials: true,
        }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  const getRating = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/buyer/get-rating/${id}`,
        { withCredentials: true }
      );
      console.log(response);

      setRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching rating:", error);
    } finally {
      setLoading(false);
    }
  };

  const getComment = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/buyer/get-comments/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setReviews(res.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/buyer/get-recommended-products?page=${1}`,
        { withCredentials: true }
      );
      setRecommendedProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addRating = async (rating) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/buyer/add-rating/${id}`,
        { rating },
        { withCredentials: true }
      );
      console.log(res);
      setUserRating(0);
      getRating();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
      setUserRating(0);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/buyer/add-comment/${id}`,
        { comment: userReview },
        { withCredentials: true }
      );
      console.log(res);
      getComment();
      setUserReview("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
    getRating();
    getComment();
    getRecommendedProduct();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-950 to-black text-white">
      <BuyerNavbar />

      {loading ? (
        <Loader />
      ) : (
        <>
          {!product ? (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
              Product not found
            </div>
          ) : (
            <>
              {/* Product + Reviews Section */}
              <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Image Section */}
                <div className="col-span-1 flex justify-center items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-2xl shadow-2xl w-full h-[450px] object-cover border border-gray-700 hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Details Section */}
                <div className="col-span-2 space-y-6">
                  <h1 className="text-4xl font-bold text-indigo-400 tracking-wide flex flex-col gap-1">
                    {product.name}
                    <span className="text-yellow-400 text-lg">
                      {rating > 0
                        ? `⭐ ${rating.toFixed(1)} / 5`
                        : "No ratings yet"}
                    </span>
                  </h1>

                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold text-gray-400">
                        Category:
                      </span>{" "}
                      {product.category[0].toUpperCase() +
                        product.category.slice(1)}
                    </p>
                  </div>

                  <p className="text-3xl font-semibold text-indigo-500">
                    ₹{product.price.toFixed(2)}
                  </p>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-indigo-700/40"
                    >
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-black font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-yellow-700/40">
                      Buy Now
                    </button>
                  </div>

                  <div className="rounded-2xl shadow-md mt-6">
                    <h2 className="text-xl font-semibold text-gray-200 mb-3">
                      Rate the Product
                    </h2>

                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(null)}
                          className={`text-4xl transition-all duration-200 transform ${
                            (hover || userRating) >= star
                              ? "text-yellow-400 scale-110"
                              : "text-gray-600 hover:text-yellow-400"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    {userRating > 0 && (
                      <p className="mt-3 text-gray-400 italic">
                        You rated this product{" "}
                        <span className="text-yellow-400 font-semibold">
                          {userRating}
                        </span>{" "}
                        out of 5 ⭐
                        <button
                          className="ml-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium shadow-md transition"
                          onClick={() => addRating(userRating)}
                        >
                          Submit Rating
                        </button>
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl px-6 
                flex flex-col justify-between max-h-[500px] 
                overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 
                shadow-lg shadow-black/40 relative">

                  {/* Header */}
                  <h2 className="text-2xl font-semibold text-indigo-400 sticky top-0 bg-gray-900 pt-3 pb-3 z-10 border-b border-gray-800 shadow-md">
                    Reviews
                  </h2>

                  {/* Reviews list */}
                  <div className="flex-1 space-y-3 py-2">
                    {reviews.map((review, i) => (
                      <div
                        key={i}
                        className="group bg-gray-800/70 hover:bg-gray-800 transition-all duration-300 p-4 rounded-xl border border-gray-700 hover:border-indigo-600"
                      >
                        <p className="text-gray-300 text-sm italic leading-relaxed">{review} </p>
                      </div>
                    ))}
                  </div>

                  {/* Sticky input section */}
                  <div className="bg-gray-900 pt-3 pb-4 border-t border-gray-800 sticky bottom-0">
                    <textarea
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      rows="2"
                      placeholder="Share your experience..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                    ></textarea>

                    <button
                      onClick={() => addComment()}
                      className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>


              {/* Divider */}
              <div className="border-t border-gray-800 my-10 mx-10"></div>

              {/* Related Products Section */}
              <div className="max-w-7xl mx-auto px-6 py-6">
                <h2 className="text-2xl font-semibold text-indigo-400 mb-6">
                  Recommended Products
                </h2>

                <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {recommendedProducts.length > 0 ? (
                    recommendedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-gray-800/40 border border-gray-700/60 rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-gray-700 transition transform duration-200"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() =>
                            navigate(`/buyer/products/${product._id}`)
                          }
                        />
                        <div className="p-4 flex flex-col">
                          <h3 className="text-lg text-white font-semibold mb-2 truncate">
                            {product.name}
                          </h3>
                          <p className="text-white mb-4">
                            ₹{product.price.toFixed(2)} |{" "}
                            {product.category[0].toUpperCase() +
                              product.category.slice(1)}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center mt-auto">
                            <button
                              onClick={() => handleAddToCart(product._id)}
                              className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleBuyNow(product._id)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 col-span-full">
                      No products found.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
