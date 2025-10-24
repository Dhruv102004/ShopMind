import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import axios from "axios";

export default function SellerNavbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null); // Ref to detect clicks outside

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,{},
        {
          withCredentials: true,
        }
      );
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Listen for click events
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 px-6 py-3 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          SM
        </div>
        <h1 className="text-xl font-semibold text-white">ShopMIND</h1>
        <div className="flex items-center space-x-8 px-5">
          <a
            href="../seller/home"
            className="text-gray-300 hover:text-indigo-400 transition duration-200"
          >
            HOME
          </a>
          <a
            href="../seller/products"
            className="text-gray-300 hover:text-indigo-400 transition duration-200"
          >
            PRODUCTS
          </a>
        </div>
      </div>

      {/* Avatar with Dropdown */}
      <div className="relative" ref={dropdownRef}>
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
                navigate("../seller/profile");
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              Profile
            </button>

            <button
              onClick={() => {
                setOpen(false);
                // Add your logout function here
                handleLogout();
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
