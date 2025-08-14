import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import HierarchyViewer from "../components/HierarchyViewer";
import AddNodeModal from "../components/AddNodeModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import { fetchHierarchyData, uploadHierarchyData } from "../utils/api.js";
import { toast } from "react-toastify";

const Home = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [count , setCount] = useState(0);

  const reloadHierarchy = async () => {
    try {
      const data = await fetchHierarchyData();
      setHierarchyData(data.tree);
      setCount(data.totalNodes);
    } catch (error) {
      const errMsg = error.response?.data || "Unexpected error occurred.";
      toast.error(`Error reloading: ${errMsg}`);
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

  // const handleParsedData = async (data) => {
  //   try {
  //     await uploadHierarchyData(data);
  //     await reloadHierarchy();
  //     console.log("Parsed and uploaded hierarchy successfully.");
  //     toast.success("Hierarchy uploaded successfully.");
  //   } catch (err) {
  //    const errMsg = error.response?.data || "Unexpected error occurred.";
  //    toast.error(`Error uploading: ${errMsg}`);
  //   }
  // };

  useEffect(() => {
    reloadHierarchy();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            Asset Hierarchy Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Upload, visualize, and manage your asset structure efficiently
          </p>
           <p className="mb-4">Total Nodes: {count}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 ">
          <div className="lg:w-2/3 w-full bg-white shadow rounded-lg p-6 ">
            {hierarchyData ? (
              <HierarchyViewer
                data={hierarchyData}
                onAdd={handleAddClick}
                onDelete={handleDeleteClick}
                onUpdate={reloadHierarchy}
                onAddHierarchy={handleAddClick}
              />
            ) : (
              <p className="text-center text-gray-500">
                No hierarchy data available. Please upload a JSON file.
              </p>
            )}
          </div>

          <div className="lg:w-1/3 w-full bg-white shadow rounded-lg p-6 space-y-6 h-fit">
            <FileUploader onUploadSuccess={reloadHierarchy} />
          </div>
        </div>
      </div>

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
