import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiURL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("isSeller", isSeller);

      const response = await axios.post(`${apiURL}/users/register`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.log("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        {loading ? (
            <Loader/>
        ) : (  
            <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md backdrop-blur-lg bg-gray-800/40 border border-gray-700/60 shadow-2xl rounded-2xl p-8">
                {/* Animated Toggle */}
                <div className="relative flex bg-gray-700/40 rounded-full p-2 mb-6 w-64 mx-auto cursor-pointer">
                <div
                    className={`absolute top-1 left-1 w-1/2 h-8 bg-indigo-600 rounded-full shadow-md transform transition-transform duration-300 ${
                    isSeller ? "translate-x-full" : ""
                    }`}
                />
                <div
                    className="relative z-10 w-1/2 text-center text-white font-medium"
                    onClick={() => setIsSeller(false)}
                >
                    User
                </div>
                <div
                    className="relative z-10 w-1/2 text-center text-white font-medium"
                    onClick={() => setIsSeller(true)}
                >
                    Seller
                </div>
                </div>

                <h2 className="text-3xl font-semibold text-center text-white drop-shadow-md mb-6">
                Register
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                    Full Name
                    </label>
                    <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-700/40 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                    />
                </div>

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

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                    Confirm Password
                    </label>
                    <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? "Registering..." : "Register"}
                </button>
                </form>

                <div className="flex justify-center mt-4 text-sm">
                <a href="/login" className="text-indigo-400 hover:underline">
                    Already have an account? Login
                </a>
                </div>
            </div>
            </div>
        )}
    </>
    
  );
}
