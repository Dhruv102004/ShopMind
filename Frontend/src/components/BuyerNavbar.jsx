import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";
import { ShoppingCart } from "lucide-react";

export default function BuyerNavbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  // 🧠 Inside your component (add this new ref)
  const searchRef = useRef(null);

  // 🔍 Debounced search function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchedProducts([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/buyer/search-products?name=${query}`,
        { withCredentials: true }
      );
      setSearchedProducts(res.data.products || []);
    } catch (err) {
      console.error("Error searching products:", err);
      setSearchedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Debounce search calls
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); // delay 500ms

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // 🧍‍♂️ Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🖱️ Close dropdown when clicking outside (extend existing useEffect)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchedProducts([]); // 👈 closes the search dropdown
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 px-6 py-3 flex items-center justify-between shadow-md">
      {/* 🌐 Logo + Links */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          SM
        </div>
        <h1 className="text-xl font-semibold text-white">ShopMIND</h1>
        <div className="flex items-center space-x-8 px-5">
          <a
            href="../buyer/home"
            className="text-gray-300 hover:text-indigo-400 transition duration-200"
          >
            HOME
          </a>
        </div>
      </div>

      {/* 🔎 Search Bar */}
      <div ref={searchRef} className="relative flex-1 flex justify-center">
        <div className="flex w-1/2 space-x-2">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(
                  `/buyer/search-results?query=${encodeURIComponent(
                    searchQuery
                  )}`
                );
                setSearchedProducts([]);
              }
            }}
          />

          <button
            onClick={() => {
              if (searchQuery.trim()) {
                navigate(
                  `/buyer/search-results?query=${encodeURIComponent(
                    searchQuery
                  )}`
                );
                setSearchedProducts([]);
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* Dropdown remains same */}
        {(loading ||
          searchedProducts.length > 0 ||
          (searchQuery && !loading)) && (
          <div className="absolute top-full mt-2 w-1/2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
            {loading && (
              <div className="px-4 py-3 text-gray-600 text-sm">
                Searching...
              </div>
            )}

            {!loading && searchedProducts.length > 0 && (
              <>
                {searchedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer transition"
                    onClick={() => {
                      navigate(`/buyer/products/${product._id}`);
                      setSearchedProducts([]);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded mr-3 border"
                    />
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-gray-800 font-medium">
                        {product.name}
                      </span>
                      <span className="text-indigo-600 font-semibold">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!loading && searchedProducts.length === 0 && searchQuery && (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No products found
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🛒 Cart + Profile */}
      <div className="flex items-center space-x-4" ref={dropdownRef}>
        {/* Cart Button */}
        <button
          onClick={() => navigate("../buyer/cart")}
          className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          <ShoppingCart className="w-6 h-6 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white font-semibold rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium hover:ring-2 hover:ring-indigo-400 transition"
          >
            U
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("../buyer/profile");
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
