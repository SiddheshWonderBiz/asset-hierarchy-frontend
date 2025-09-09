import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/api.js";
import { toast } from "react-toastify";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoPersonOutline,
  IoLockClosedOutline,
} from "react-icons/io5";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // Default role is "Viewer" - no role selection needed
      await signup(username, email, password, "Viewer");
      toast.success("Signup successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-lg">
            Join the Asset Hierarchy System
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:shadow-3xl transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IoPersonOutline className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Choose a username"
                  disabled={loading}
                  required
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      username.length > 15
                        ? "text-red-600 bg-red-50"
                        : "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {username.length}/20
                  </span>
                </div>
              </div>
            </div>
            {/* Email Field */}
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12H8m8-6H8m8 12H8m-2 0a2 2 0 01-2-2V8a2 2 0 
          012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 
                 rounded-xl focus:ring-2 focus:ring-purple-500 
                 focus:border-purple-500 focus:bg-white 
                 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IoLockClosedOutline className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Create a strong password"
                  disabled={loading}
                  required
                  maxLength={30}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <div className="ml-1 flex items-center space-x-3 text-xs">
                <span
                  className={`flex items-center ${
                    password.length >= 6 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-1 ${
                      password.length >= 6 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  6+ characters required
                </span>
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    password.length > 25
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 bg-gray-100"
                  }`}
                >
                  {password.length}/30
                </span>
              </div>
            </div>

            {/* Account Type Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">
                    Viewer Account
                  </h4>
                  <p className="text-xs text-blue-600">
                    You'll have read-only access to view hierarchy and signals
                  </p>
                </div>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
            >
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </div>
                </div>
              )}
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Create Account
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
