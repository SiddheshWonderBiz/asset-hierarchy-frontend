import React, { useState } from "react";
import { IoChevronForward, IoChevronDown } from "react-icons/io5";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";

const NodeItem = ({
  node,
  onUpdate,
  onAdd,
  onDelete,
  searchTerm = "",
  isSearchMatch = false,
  autoExpand = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const hasChildren = node.children && node.children.length > 0;

  // Auto-expand when search term is present and node has children
  React.useEffect(() => {
    if (searchTerm && hasChildren) {
      setIsExpanded(true);
    } else if (!searchTerm) {
      setIsExpanded(autoExpand);
    }
  }, [searchTerm, hasChildren, autoExpand]);

  // Function to highlight search term in node name
const highlightSearchTerm = (text, searchTerm) => {
  if (!text) return null; // avoid crash if name is missing
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        className="bg-green-200 text-green-800 px-1 rounded font-semibold"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};


  return (
    <div className="group">
      <div
        className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
          isSearchMatch
            ? "border-emerald-400 shadow-md ring-2 ring-emerald-100"
            : "border-gray-200 hover:border-emerald-300"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 flex-1">
            {hasChildren && (
              <button
                className="text-gray-500 hover:text-emerald-600 transition-colors duration-200 p-1 rounded hover:bg-emerald-50"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <IoChevronDown size={20} />
                ) : (
                  <IoChevronForward size={20} />
                )}
              </button>
            )}

            <div className="flex items-center gap-3 flex-1">
              
              <span className="font-medium text-gray-800 text-lg">
                {highlightSearchTerm(node.name, searchTerm)}
              </span>
              {hasChildren && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                  {node.children.length}{" "}
                  {node.children.length === 1 ? "child" : "children"}
                </span>
              )}
              {/* {isSearchMatch && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
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
                  Match
                </span>
              )} */}
              
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
              onClick={() => onAdd(node)}
              title="Add child node"
            >
              <AiOutlinePlusCircle size={22} />
            </button>
            <button
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
              onClick={() => onDelete(node)}
              title="Delete node"
            >
              <AiOutlineDelete size={22} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <div className="space-y-3">
              {node.children.map((child, index) => (
                <div key={child.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-1.5 left-0 right-0 h-px bg-gray-200"></div>
                  )}
                  <div className="pl-4 border-l-2 border-emerald-200">
                    <NodeItem
                      node={child}
                      onUpdate={onUpdate}
                      onAdd={onAdd}
                      onDelete={onDelete}
                      searchTerm={searchTerm}
                      isSearchMatch={child.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())}
                      autoExpand={Boolean(searchTerm)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeItem;
