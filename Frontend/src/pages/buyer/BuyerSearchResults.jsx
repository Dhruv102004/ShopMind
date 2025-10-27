import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BuyerNavbar from "../../components/BuyerNavbar";
import Loader from "../../components/Loader";

export default function BuyerSearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = async (productId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add-item/${productId}`,
        null,
        {
          params: { quantity: 1 }, 
          withCredentials: true,
        }
      );
      console.log(res);
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/buyer/search-products?name=${query}&page=${page}`,
          { withCredentials: true }
        );
        setProducts(res.data.products || []);
        setMaxPage(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <BuyerNavbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-900 text-white p-6">
          <h1 className="text-2xl font-bold mb-6">
            Search Results for "{query}"
          </h1>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-800/40 border border-gray-700/60 rounded-lg shadow-md overflow-hidden hover:scale-105 hover:shadow-gray-700 transition transform duration-200"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => navigate(`/buyer/products/${product._id}`)}
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
          )}
          <div className="my-6 flex items-center justify-center">
            <button
              className={`${
                page === 1
                  ? "bg-gray-600 hover:bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }  text-white px-4 py-2 rounded-lg shadow-md transition`}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="mx-4 text-white">
              {page}/{maxPage}
            </span>
            <button
              className={`${
                page === maxPage
                  ? "bg-gray-600 hover:bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-4 py-2 rounded-lg shadow-md transition`}
              onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
              disabled={page === maxPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
