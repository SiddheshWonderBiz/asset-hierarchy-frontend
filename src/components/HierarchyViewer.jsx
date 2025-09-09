import React from "react";
import NodeItem from "./NodeItem";
import SearchBar from "./SearchBar";


const HierarchyViewer = ({
  data,
  onAdd,
  onDelete,
  onUpdate,
  onAddHierarchy,
  onAddSignal,
  onSearch,
  searchTerm,
  searchResults,
  totalNodes,
  role
}) => {
  const isAdmin = role === "Admin";
  return (
    <section className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            Asset Hierarchy
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your organizational structure
          </p>
        </div>
        {isAdmin &&(<button
          onClick={() => onAddHierarchy(null)}
          className="bg-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium flex items-center gap-2"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Hierarchy
        </button>)}
        

      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={onSearch}
        searchResults={searchResults}
        totalNodes={totalNodes}
      />

      <div className="bg-gray-50 rounded-xl p-6">
        {data?.children?.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {data.children.map((child, index) => (
              <div key={child.id || child.name || index} className="relative">
                {index > 0 && (
                  <div className="absolute -top-1 left-0 right-0 h-px bg-gray-200"></div>
                )}
                <NodeItem
                  node={child}
                  onAdd={isAdmin ? onAdd : undefined} // ✅ disable if not Admin
                  onDelete={isAdmin ? onDelete : undefined}
                  onUpdate={isAdmin ? onUpdate : undefined}
                  onAddSignal={onAddSignal}
                  searchTerm={searchTerm}
                  isSearchMatch={(child?.name?.toLowerCase() || "").includes(
                    (searchTerm || "").toLowerCase()
                  )}
                  autoExpand={Boolean(searchTerm)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Upload a JSON/XML file or create a new hierarchy to get started.
            </p>
            {isAdmin && (
            <button
              onClick={() => onAddHierarchy(null)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 px-4 rounded-lg shadow transition-all duration-200 transform hover:scale-105 font-medium"
            >
              Create First Hierarchy
            </button>)}
          </div>
        )}
      </div>
    </section>
  );
};

export default HierarchyViewer;
