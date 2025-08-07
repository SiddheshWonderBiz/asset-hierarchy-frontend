import React, { useState } from "react";
import { addNode } from "../utils/api.js";
import { toast } from "react-toastify";

const AddNodeModal = ({ parentNode, onClose, onSuccess }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(""); // 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !name || !parentId) return;

    const newNode = {
      id,
      name,
      children: [],
    };

    try {
      await addNode(parentId, newNode);
      
      toast.success(`Node ${name} added successfully.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding node:", error);
      const errMsg =   error.response?.data?.error ||error.response?.data?.message ||  error.response?.data ||  error.message|| "Unexpected error occurred.";
      toast.error(`Error adding node: ${errMsg}`);
    }

    setId("");
    setName("");
    setParentId(""); 
  };

  if (!parentNode) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        
        <h2 className="text-xl font-bold mb-4">
          Add Child to <span className="text-green-600">{parentNode.id}:{parentNode.name}</span>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Enter Parent ID</label>
            <input
              type="number"
              value={parentId}
              onChange={(e) => setParentId(Number(e.target.value))}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
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
