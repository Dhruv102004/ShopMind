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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="hover:scale-105 hover:shadow-gray-700 bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition"
                  onClick={() => navigate(`/buyer/products/${product._id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4 border border-gray-700"
                  />
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-indigo-400 font-bold text-xl">
                    ₹{product.price}
                  </p>
                </div>
              ))}
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
