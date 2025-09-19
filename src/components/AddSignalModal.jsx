import React, { useState, useEffect } from "react";
import { addSignal, updateSignal } from "../utils/api.js";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const AddSignalModal = ({ node, onClose, onSuccess, editingSignal = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    valueType: "String",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const valueTypes = ["String", "Int", "Real"];

  // If editing, populate form with existing data
  useEffect(() => {
    if (editingSignal) {
      setFormData({
        name: editingSignal.name || "",
        valueType: editingSignal.valueType || "String",
        description: editingSignal.description || "",
      });
    }
  }, [editingSignal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Signal name is required");
      return;
    }

    setLoading(true);
    try {
      if (editingSignal) {
        // Update existing signal
        await updateSignal(node.id, editingSignal.id, formData);
        toast.success("Signal updated successfully!");
      } else {
        // Add new signal
        await addSignal(node.id, formData);
        toast.success("Signal added successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-800 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {editingSignal ? "Edit Signal" : "Add New Signal"}
          </h2>
          <p className="text-purple-100 mt-1">
            {editingSignal
              ? "Update signal details"
              : `Add signal to: ${node?.name}`}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Signal Name */}
            {/* Signal Name */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Signal Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter signal name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                maxLength={50}
              />
              {/* Character Counter */}
              <div className="absolute right-3 bottom-2 text-xs">
                <span
                  className={`font-medium ${
                    formData.name.length > 45 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {formData.name.length}/50
                </span>
              </div>
            </div>

            {/* Value Type */}
            <div>
              <label
                htmlFor="valuetype"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Value Type *
              </label>
              <select
                name="valueType"
                value={formData.valueType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              >
                {valueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            {/* Description */}
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter signal description (optional)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                maxLength={300}
              />
              {/* Character Counter */}
              <div className="absolute right-3 bottom-2 text-xs">
                <span
                  className={`font-medium ${
                    formData.description.length > 280
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formData.description.length}/300
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-purple-800 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingSignal ? "Updating..." : "Adding..."}
                </div>
              ) : editingSignal ? (
                "Update Signal"
              ) : (
                "Add Signal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
AddSignalModal.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  editingSignal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    valueType: PropTypes.string,
    description: PropTypes.string,
  }),
};
export default AddSignalModal;
