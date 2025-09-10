import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline, IoLogOutOutline, IoChevronDownOutline, IoShieldOutline } from 'react-icons/io5';
import { fetchCurrentUser, logout } from '../utils/api.js'; // <-- update imports

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch user details from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
      }
    };
    loadUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // <-- backend clears cookie
      navigate('/login');
    } finally {
      setShowDropdown(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === 'Admin'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const isAdmin = () => user?.role === 'Admin';

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">
                <button onClick={() => navigate('/')}>Asset Hierarchy</button>
              </h1>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg px-3 py-2 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || "Unknown User"}
                  </p>
                  <div className="flex items-center justify-end">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user?.role
                      )}`}
                    >
                      <IoShieldOutline className="w-3 h-3 mr-1" />
                      {user?.role || 'Unknown'}
                    </span>
                  </div>
                </div>
                <IoPersonCircleOutline className="w-8 h-8 text-gray-400" />
                <IoChevronDownOutline
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user?.role
                      )}`}
                    >
                      <IoShieldOutline className="w-3 h-3 mr-1" />
                      {user?.role || 'Unknown'}
                    </span>
                    {isAdmin() && (
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        Full Access
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ Logs Link - Only for Admins */}
                {isAdmin() && (
                  <button
                    onClick={() => {
                      navigate('/logs');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-200"
                  >
                    View Logs
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors duration-200"
                >
                  <IoLogOutOutline className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
