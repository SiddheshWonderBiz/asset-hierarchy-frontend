import React, { useState } from "react";
import { IoChevronForward, IoChevronDown } from "react-icons/io5";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { updateNode } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDrag, useDrop } from "react-dnd";
import {fetchCurrentUser} from "../utils/api.js";

const NodeItem = ({
  node,
  onUpdate,
  onAdd,
  onDelete,
  onAddSignal,
  searchTerm = "",
  isSearchMatch = false,
  autoExpand = false,
  onMoveNode,
}) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const navigate = useNavigate();

  const hasChildren = node.children && node.children.length > 0;
  const isAdmin = fetchCurrentUser().role === "Admin";

  const handleDoubleClick = () => {
    if (!onUpdate) return;
    setIsEditing(true);
    setNewName(node.name);
  };
  const [{ isDragging }, drag] = useDrag({
    type: "NODE",
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag : isAdmin
  });

  const [, drop] = useDrop({
    accept: "NODE",
    canDrop: () => isAdmin,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        console.log(`Moving node ${item.id} under ${node.id}`);
        onMoveNode && onMoveNode(item.id, node.id);
      }
    },
  });

  const handleBlur = async () => {
    if (newName.trim() && newName !== node.name) {
      try {
        await updateNode(node.id, newName);
        onUpdate && onUpdate(node.id, newName); // tell parent to refresh
        toast.success(`Node renamed to "${newName}"`);
      } catch (error) {
        console.error("Update failed:", error);
        toast.error(error.message || "Failed to update node");
        setNewName(node.name); //  revert back to old name on error
      }
    }
    setIsEditing(false); //  always exit edit mode
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setNewName(node.name);
      setIsEditing(false);
    }
  };

  const handleViewSignals = () => {
    // Navigate to signals page with node info
    navigate(`/signals/${node.id}`, {
      state: { nodeInfo: { id: node.id, name: node.name } },
    });
  };

  const handleAddSignalClick = () => {
    if (onAddSignal) {
      onAddSignal(node);
    }
  };

  // Auto-expand when searching
  React.useEffect(() => {
    if (searchTerm && hasChildren) {
      setIsExpanded(true);
    } else if (!searchTerm) {
      setIsExpanded(autoExpand);
    }
  }, [searchTerm, hasChildren, autoExpand]);

  // Highlight search term
  const highlightSearchTerm = (text, searchTerm) => {
    if (!text) return null;
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
    <div
      ref={(el) => (isAdmin ? drag(drop(el) ) : null)}
      className={`group ${isDragging ? "opacity-50" : ""}`}
    >
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

              <div
                className="flex items-center gap-3 flex-1"
                onDoubleClick={handleDoubleClick}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="border px-2 py-1 rounded w-full text-gray-800 text-lg"
                  />
                ) : (
                  <span className="font-medium text-gray-800 text-lg">
                    {highlightSearchTerm(node.name, searchTerm)}
                  </span>
                )}

                {hasChildren && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                    {node.children.length}{" "}
                    {node.children.length === 1 ? "child" : "children"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* View/Manage Signals Button */}
              <button
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                onClick={handleViewSignals}
                title="View/Manage signals"
              >
                <IoSettingsOutline size={22} />
              </button>

              {/* Add Signal Button */}
              <button
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                onClick={handleAddSignalClick}
                title="Add signal"
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </button>

              {/* Add Child Node Button */}
              {onAdd && (
                <button
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                  onClick={() => onAdd(node)}
                  title="Add child node"
                >
                  <AiOutlinePlusCircle size={22} />
                </button>
              )}

              {/* Delete Node Button */}
              {onDelete && (
                <button
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110"
                  onClick={() => onDelete(node)}
                  title="Delete node"
                >
                  <AiOutlineDelete size={22} />
                </button>
              )}
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
                        onAddSignal={onAddSignal}
                        searchTerm={searchTerm}
                        isSearchMatch={child.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())}
                        autoExpand={Boolean(searchTerm)}
                        onMoveNode={onMoveNode}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeItem;
