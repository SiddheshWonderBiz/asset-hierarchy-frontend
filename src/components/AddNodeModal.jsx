import React, { useState } from "react";
import { addNode, addHierarchy } from "../utils/api.js"; // ✅ Changed AddHierarchy → addHierarchy to match JS naming convention
import { toast } from "react-toastify";

const AddNodeModal = ({ parentNode = null, onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    const newNode = {
      name,
      children: [],
    };

    try {
      if (parentNode && parentNode.id) {
        // ✅ Case: Adding a child node
        await addNode(parentNode.id, newNode);
        toast.success(`Node "${name}" added under "${parentNode.name}".`);
      } else {
        // ✅ Case: Adding new hierarchy directly under root
        await addHierarchy(newNode);
        toast.success(`Hierarchy "${name}" added successfully.`);
      }

      onSuccess(); // Refresh data
      onClose(); // Close modal
      setName(""); // Reset field
    } catch (error) {
      console.error("Error adding node:", error);
      toast.error(error?.message || "Failed to add node");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {parentNode && parentNode.name
            ? <>Add Child to <span className="text-blue-600">{parentNode.name}</span></>
            : "Add New Hierarchy"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
              maxLength={50}
            />
            <p className="text-sm text-gray-500 mt-1">
              {name.length}/50 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNodeModal;
