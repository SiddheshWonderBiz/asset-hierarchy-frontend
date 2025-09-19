import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch, searchResults, totalNodes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="w-full mb-6">
      <div className="relative">
        <div
          className={`relative flex items-center transition-all duration-200 ${
            isFocused ? "transform scale-105" : ""
          }`}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? "text-emerald-500" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search nodes by name..."
            className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-xl shadow-sm transition-all duration-200 outline-none text-gray-700 placeholder-gray-400 ${
              isFocused
                ? "border-emerald-400 shadow-lg ring-4 ring-emerald-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />

          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Search Results Summary */}
        {searchTerm && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {searchResults > 0 ? (
                <>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-emerald-600">
                      {searchResults}
                    </span>{" "}
                    matching node{searchResults !== 1 ? "s" : ""} with their
                    children
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-600">No matching nodes found</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">of {totalNodes} total nodes</span>
              {searchResults > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Children View
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.number.isRequired,
  totalNodes: PropTypes.number.isRequired,
};
export default SearchBar;
