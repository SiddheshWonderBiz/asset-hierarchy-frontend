import React, { useState } from "react";
import { deleteNode } from "../utils/api";
import { toast } from "react-toastify";

const ConfirmDeleteModal = ({ nodeToDelete, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!nodeToDelete) return;
    setLoading(true);
    try {
      await deleteNode(nodeToDelete.id);  
      toast.success(`Node ${nodeToDelete.name} deleted successfully.`);
      onSuccess();                       
      onClose();     
                           
    } catch (error) {
       console.error("Error deleting node:", error);
            toast.error(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p>
          Are you sure you want to delete{" "}
          <strong>{nodeToDelete?.name}</strong>?
        </p>
        <div className="mt-4 space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
