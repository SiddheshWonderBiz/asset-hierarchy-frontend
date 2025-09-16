import React, { useState } from "react";
import { addNode, addHierarchy } from "../utils/api.js";
import { toast } from "react-toastify";

const AddNodeModal = ({ parentNode = null, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setLoading(true);

    const newNode = {
      name,
      children: [],
    };

    try {
      let addedNode;
      
      if (parentNode && parentNode.id) {
        addedNode = await addNode(parentNode.id, newNode);
        toast.success(`Node "${name}" added under "${parentNode.name}".`);
      } else {
        addedNode = await addHierarchy(newNode);
        toast.success(`Hierarchy "${name}" added successfully.`);
      }

      // Create the complete node object with the response data
      // Correct version: take the node from backend
const completeNode = addedNode.addedNode || addedNode; // backend returns { addedNode }


      // Pass the parent ID and new node data to the success handler
      onSuccess(parentNode?.id || null, completeNode);
      onClose();
      setName("");
    } catch (error) {
      console.error("Error adding node:", error);
      toast.error(error.message || "Failed to add node. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {parentNode && parentNode.name ? (
              <>Add Child to <span className="text-emerald-200 font-medium">{parentNode.name}</span></>
            ) : (
              "Add New Hierarchy"
            )}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Node Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 p-3 rounded-lg transition-all duration-200 outline-none"
                  placeholder="Enter node name..."
                  required
                  maxLength={50}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className={`text-xs font-medium ${name.length > 40 ? 'text-red-500' : 'text-gray-400'}`}>
                    {name.length}/50
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-300 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Adding...
                  </div>
                ) : (
                  "Add Node"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNodeModal;