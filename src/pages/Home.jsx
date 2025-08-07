import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import HierarchyViewer from "../components/HierarchyViewer";
import AddNodeModal from "../components/AddNodeModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import { fetchHierarchyData ,uploadHierarchyData } from "../utils/api.js";

const Home = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const reloadHierarchy = async () => {
    try {
      const data = await fetchHierarchyData();
      setHierarchyData(data);
    } catch (error) {
      console.error("Error reloading hierarchy:", error);
    }
  };

  const handleAddClick = (node) => {
    setSelectedNode(node);
    setShowAddNodeModal(true);
  };

  const handleDeleteClick = (node) => {
    setSelectedNode(node);
    setShowConfirmDeleteModal(true);
  };

const handleParsedData = async (data) => {
  try {
    await uploadHierarchyData(data);  // Send to backend first
    await reloadHierarchy();          // Then fetch fresh from backend
    console.log("Parsed and uploaded hierarchy successfully.");
  } catch (err) {
    console.error("Error uploading parsed data:", err);
  }
};


  useEffect(() => {
    reloadHierarchy();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Asset Hierarchy Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Upload, visualize, and manage your asset structure efficiently
          </p>
        </div>

        {/* File Uploader */}
        <div className="bg-white shadow rounded-lg p-6">
          <FileUploader onUploadSuccess={reloadHierarchy} />
        </div>

        {/* Hierarchy Viewer */}
        <div className="bg-white shadow rounded-lg p-6">
          {hierarchyData ? (
            <HierarchyViewer
              data={hierarchyData}
              onAdd={handleAddClick}
              onDelete={handleDeleteClick}
              onUpdate={reloadHierarchy}
            />
          ) : (
            <p className="text-center text-gray-500">
              No hierarchy data available. Please upload a JSON file.
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddNodeModal && (
        <AddNodeModal
          parentNode={selectedNode}
          onClose={() => {
            setShowAddNodeModal(false);
            setSelectedNode(null);
          }}
          onSuccess={reloadHierarchy}
        />
      )}

      {showConfirmDeleteModal && (
        <ConfirmDeleteModal
          nodeToDelete={selectedNode}
          onClose={() => {
            setShowConfirmDeleteModal(false);
            setSelectedNode(null);
          }}
          onSuccess={reloadHierarchy}
        />
      )}
    </main>
  );
};

export default Home;
