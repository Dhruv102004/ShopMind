import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiURL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert to x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(`${apiURL}/users/login`, formData, {
        withCredentials: true, // allow backend to set cookies
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Login successful:", response.data);
      localStorage.setItem("isSeller", response?.data?.user?.isSeller);
      localStorage.setItem("fullName", response?.data?.user?.fullName);
      localStorage.setItem("_id", response?.data?.user?._id);
      navigate("/seller/home");
    } catch (err) {
      console.log("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {loading ? (
      <Loader />
     ):(
      <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full max-w-sm backdrop-blur-lg bg-gray-800/40 border border-gray-700/60 shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-center text-white drop-shadow-md mb-6">
            Login
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700/40 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700/40 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600/80 hover:bg-indigo-700/90 text-white py-2 rounded-lg transition duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm">
            <a href="#" className="text-indigo-400 hover:underline">
              Forgot password?
            </a>
            <a href="/register" className="text-indigo-400 hover:underline">
              Don't have an account?
            </a>
          </div>
        </div>
      </div>
     )}

    </>
    
  );
}
