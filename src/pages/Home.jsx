import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import HierarchyViewer from "../components/HierarchyViewer";
import AddNodeModal from "../components/AddNodeModal.jsx";
import AddSignalModal from "../components/AddSignalModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import { fetchHierarchyData, updateNode, userRole , reorderNode} from "../utils/api.js";
import { toast } from "react-toastify";
import { startConnection, getConnection } from "../utils/signalr";

const Home = () => {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddSignalModal, setShowAddSignalModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(0);
  const [filteredHierarchyData, setFilteredHierarchyData] = useState(null);
  const [role, setRole] = useState(null);

useEffect(() => {
  setRole(userRole());
  reloadHierarchy();

  const initSignalR = async () => {
    const conn = await startConnection();

    if (conn) {
      // Remove old handlers first (avoid duplicates)
      conn.off("nodeAdded");
      conn.off("signalAdded");

      // Attach fresh handlers
      conn.on("nodeAdded", (message) => {
        console.log("Node added:", message);
        toast.info(`New node added: ${message}`);
        reloadHierarchy();
      });

      conn.on("signalAdded", (message) => {
        console.log("Signal added:", message);
        toast.info(`New signal added: ${message}`);
        reloadHierarchy();
      });
    }
  };

  initSignalR();

  return () => {
    const conn = getConnection();
    if (conn) {
      conn.off("nodeAdded");
      conn.off("signalAdded");
      conn.stop();
    }
  };
}, []);


  const reloadHierarchy = async () => {
    try {
      setLoading(true);
      const data = await fetchHierarchyData();
      setHierarchyData(data.tree);
      setFilteredHierarchyData(data.tree);
      setCount(data.totalNodes);
    } catch (error) {
      const errMsg = error.response?.data || "Unexpected error occurred.";
      toast.error(`Error reloading: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };
  const moveNode = async (nodeId, newParentId) => {
  try {
    // Call your backend API to move node
    await reorderNode(nodeId, newParentId);

    // Reload hierarchy from backend (or update state locally)
    reloadHierarchy();

    toast.success("Node moved successfully!");
  } catch (err) {
    toast.error(err.message || "Failed to move node");
  }
};

  // Function to search through hierarchy and count matches
  const searchInHierarchy = (node, term) => {
    if (!term) return 0;

    let matches = 0;
    if (node.name.toLowerCase().includes(term.toLowerCase())) {
      matches++;
    }

    if (node.children) {
      node.children.forEach((child) => {
        matches += searchInHierarchy(child, term);
      });
    }

    return matches;
  };

  // Function to filter hierarchy based on search term - shows matching nodes with their children only
  const filterHierarchy = (node, term) => {
    if (!term) return node;

    const isMatch = node.name?.toLowerCase().includes(term.toLowerCase());

    // If parent matches → return full node (with all children intact)
    if (isMatch) {
      return { ...node }; // keep all children untouched
    }

    // Otherwise → check children recursively
    const matchingChildren = [];
    if (node.children) {
      node.children.forEach((child) => {
        const filteredChild = filterHierarchy(child, term);
        if (filteredChild) {
          matchingChildren.push(filteredChild);
        }
      });
    }

    // If children match, keep them
    if (matchingChildren.length > 0) {
      return { ...node, children: matchingChildren };
    }

    // No match at all → drop
    return null;
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (hierarchyData && term.trim()) {
      // Count total matches
      let totalMatches = 0;
      if (hierarchyData.children) {
        hierarchyData.children.forEach((child) => {
          totalMatches += searchInHierarchy(child, term);
        });
      }
      setSearchResults(totalMatches);

      // Filter the hierarchy to show only matching nodes with their children
      const filteredChildren = [];
      if (hierarchyData.children) {
        hierarchyData.children.forEach((child) => {
          const result = filterHierarchy(child, term);
          if (result) {
            // If result is an array (matching children), add them individually
            if (Array.isArray(result)) {
              filteredChildren.push(...result);
            } else {
              // If result is a single node, add it
              filteredChildren.push(result);
            }
          }
        });
      }

      setFilteredHierarchyData({
        ...hierarchyData,
        children: filteredChildren,
      });
    } else {
      // Show all data when no search term
      setSearchResults(0);
      setFilteredHierarchyData(hierarchyData);
    }
  };

  const handleUpdateNode = async (id, newName) => {
    if (role !== "Admin") {
      toast.error("Only Admins can rename nodes.");
      return;
    }
    try {
      await updateNode(id, newName); // calls your update API
      toast.success("Node renamed");
      reloadHierarchy(); // refresh tree
    } catch (error) {
      toast.error(error.response?.data || "Rename failed");
    }
  };


  const handleAddClick = (node) => {
    if (role !== "Admin") {
      toast.error("Only Admins can add nodes.");
      return;
    }
    setSelectedNode(node);
    setShowAddNodeModal(true);
  };

  const handleDeleteClick = (node) => {
    if (role !== "Admin") {
      toast.error("Only Admins can delete nodes.");
      return;
    }
    setSelectedNode(node);
    setShowConfirmDeleteModal(true);
  };

  // New handler for adding signals
  const handleAddSignalClick = (node) => {
    setSelectedNode(node);
    setShowAddSignalModal(true);
  };

  const handleSignalModalSuccess = () => {
    // You might want to show a success message or update some state
    toast.success("Signal operation completed!");
  };

  useEffect(() => {
    reloadHierarchy();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50">
      {/* Header with gradient background */}
      <div className="bg-green-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Asset Hierarchy Management
            </h1>
            <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
              Upload, visualize, and manage your asset structure with ease and
              efficiency.
            </p>
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-700">
                Total Nodes: {count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hierarchy Viewer - Takes up more space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">
                        Loading hierarchy...
                      </p>
                    </div>
                  </div>
                ) : filteredHierarchyData ? (
                  <HierarchyViewer
                    data={filteredHierarchyData}
                    onAdd={handleAddClick}
                    onDelete={handleDeleteClick}
                    onUpdate={handleUpdateNode}
                    onAddHierarchy={handleAddClick}
                    onAddSignal={handleAddSignalClick}
                    onSearch={handleSearch}
                    searchTerm={searchTerm}
                    searchResults={searchResults}
                    totalNodes={count}
                    role={role}
                    moveNode={moveNode}
                  />
                ) : (
                  <div className="text-center py-20">
                    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <svg
                        className="w-10 h-10 text-gray-400"
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
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                      No Hierarchy Data
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Get started by uploading a JSON/XML file or creating your
                      first hierarchy structure.
                    </p>
                    {role === "Admin" && (<button
                      onClick={() => handleAddClick(null)}
                      className="bg-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Create Your First Hierarchy
                    </button>)}
                    
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - File Operations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden  top-8">
              <div className="bg-green-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  File Operations
                </h3>
                <p className="text-emerald-100 mt-1">
                  Import and export your data
                </p>
              </div>
              <div className="p-6">
                <FileUploader onUploadSuccess={reloadHierarchy}  role ={role}/>
              </div>
            </div>

            {/* Quick Stats Card */}
            {filteredHierarchyData && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Quick Stats
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-100">
                      <div className="text-2xl font-bold text-emerald-700">
                        {count}
                      </div>
                      <div className="text-sm text-emerald-600">
                        Total Nodes
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                      <div className="text-2xl font-bold text-blue-700">
                        {filteredHierarchyData?.children?.length || 0}
                      </div>
                      <div className="text-sm text-blue-600">
                        {searchTerm ? "Matching Nodes" : "Root Hierarchies"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

      {showAddSignalModal && (
        <AddSignalModal
          node={selectedNode}
          onClose={() => {
            setShowAddSignalModal(false);
            setSelectedNode(null);
          }}
          onSuccess={handleSignalModalSuccess}
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
