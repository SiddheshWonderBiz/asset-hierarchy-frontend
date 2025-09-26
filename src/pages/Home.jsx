import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import HierarchyViewer from "../components/HierarchyViewer";
import AddNodeModal from "../components/AddNodeModal.jsx";
import AddSignalModal from "../components/AddSignalModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import {
  fetchHierarchyData,
  updateNode,
  fetchCurrentUser,
  reorderNode,
} from "../utils/api.js";
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
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setRole(user?.role);
      } catch {
        setRole(null);
      }
    };

    const initSignalR = async () => {
      const conn = await startConnection();

      if (conn) {
        conn.off("nodeAdded");
        conn.off("signalAdded");
        conn.on("nodeAdded", ({ parentId, node }) => {
          console.log("Node added:", node, "under parent:", parentId);
          toast.info(`New node added: ${node.name}`);

          setHierarchyData((prevTree) => {
            const updatedTree = addNodeToTree(prevTree, parentId, node);
            if (searchTerm) handleSearch(searchTerm);
            else setFilteredHierarchyData(updatedTree);
            setCount(countNodes(updatedTree));
            return updatedTree;
          });
        });
        

        conn.on("signalAdded", (message) => {
          console.log("Signal added:", message);
          toast.info(`New signal added: ${message}`);
          reloadHierarchy();
        });
      }
    };

    loadUser();
    reloadHierarchy();
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

  // Utility function to find and update a node in the tree
  const updateNodeInTree = (tree, nodeId, updateFn) => {
    if (!tree) return null;

    const updateRecursive = (node) => {
      if (node.id === nodeId) {
        return updateFn(node);
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive),
        };
      }

      return node;
    };

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map(updateRecursive),
      };
    }

    return updateRecursive(tree);
  };

  // Utility function to find and remove a node from the tree
  const removeNodeFromTree = (tree, nodeId) => {
    if (!tree) return { tree: null, removed: false };

    let wasRemoved = false;

    const removeRecursive = (node) => {
      if (node.children) {
        const filteredChildren = node.children.filter((child) => {
          if (child.id === nodeId) {
            wasRemoved = true;
            return false;
          }
          return true;
        });

        const updatedChildren = filteredChildren.map(removeRecursive);

        return {
          ...node,
          children: updatedChildren,
        };
      }

      return node;
    };

    if (tree.children) {
      const filteredRootChildren = tree.children.filter((child) => {
        if (child.id === nodeId) {
          wasRemoved = true;
          return false;
        }
        return true;
      });

      const updatedTree = {
        ...tree,
        children: filteredRootChildren.map(removeRecursive),
      };

      return { tree: updatedTree, removed: wasRemoved };
    }

    const updatedTree = removeRecursive(tree);
    return { tree: updatedTree, removed: wasRemoved };
  };

  // Utility function to add a node to the tree
  const addNodeToTree = (tree, parentId, newNode) => {
    if (!tree) return null;

    if (!parentId) {
      // Adding to root level
      return {
        ...tree,
        children: [...(tree.children || []), newNode],
      };
    }

    const addRecursive = (node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
        };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(addRecursive),
        };
      }

      return node;
    };

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map(addRecursive),
      };
    }

    return addRecursive(tree);
  };

  // Count total nodes in tree
  const countNodes = (tree) => {
    if (!tree) return 0;

    let count = 0;

    const countRecursive = (node) => {
      count++;
      if (node.children) {
        node.children.forEach(countRecursive);
      }
    };

    if (tree.children) {
      tree.children.forEach(countRecursive);
    } else {
      countRecursive(tree);
    }

    return count;
  };

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
      setLoading(true);

      await reorderNode(nodeId, newParentId);

      // For move operations, it's safer to reload from server
      // as the structure changes are complex
      await new Promise((resolve) => setTimeout(resolve, 200));
      setHierarchyData(null);
      setFilteredHierarchyData(null);
      await reloadHierarchy();

      toast.success("Node moved successfully!");
    } catch (err) {
      console.error("Move node error:", err);
      toast.error(err.message || "Failed to move node");
    } finally {
      setLoading(false);
    }
  };

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

  const filterHierarchy = (node, term) => {
    if (!term) return node;

    const isMatch = node.name?.toLowerCase().includes(term.toLowerCase());

    if (isMatch) {
      return { ...node };
    }

    if (node.children) {
      for (const child of node.children) {
        const filteredChild = filterHierarchy(child, term);
        if (filteredChild) {
          return filteredChild;
        }
      }
    }

    return null;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (hierarchyData && term.trim()) {
      let totalMatches = 0;
      if (hierarchyData.children) {
        hierarchyData.children.forEach((child) => {
          totalMatches += searchInHierarchy(child, term);
        });
      }
      setSearchResults(totalMatches);

      const filteredChildren = [];
      if (hierarchyData.children) {
        hierarchyData.children.forEach((child) => {
          const result = filterHierarchy(child, term);
          if (result) {
            if (Array.isArray(result)) {
              filteredChildren.push(...result);
            } else {
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
      await updateNode(id, newName);

      // Update local state instead of reloading
      const updatedTree = updateNodeInTree(hierarchyData, id, (node) => ({
        ...node,
        name: newName,
      }));

      setHierarchyData(updatedTree);

      // Update filtered data if searching
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredHierarchyData(updatedTree);
      }

      toast.success("Node renamed successfully!");
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

  const handleAddSignalClick = (node) => {
    setSelectedNode(node);
    setShowAddSignalModal(true);
  };

  const handleSignalModalSuccess = () => {
    toast.success("Signal operation completed!");
  };

  // Handle successful node addition
  const handleNodeAddSuccess = (parentNodeId, newNodeData) => {
    // Update local state instead of reloading
    const updatedTree = addNodeToTree(hierarchyData, parentNodeId, newNodeData);
    const newCount = countNodes(updatedTree);

    setHierarchyData(updatedTree);
    setCount(newCount);

    // Update filtered data if searching
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      setFilteredHierarchyData(updatedTree);
    }
  };

  // Handle successful node deletion
  const handleNodeDeleteSuccess = (nodeId) => {
    const { tree: updatedTree, removed } = removeNodeFromTree(
      hierarchyData,
      nodeId
    );

    if (removed && updatedTree) {
      const newCount = countNodes(updatedTree);

      setHierarchyData(updatedTree);
      setCount(newCount);

      // Update filtered data if searching
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setFilteredHierarchyData(updatedTree);
      }
    }
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
            
            {/* Stats in Hero Section */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                <span className="font-semibold text-emerald-400">
                  Total Nodes: {count}
                </span>
              </div>
              
              {filteredHierarchyData && (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                  <span className="font-semibold text-emerald-400">
                    {searchTerm ? "Matching Node" : "Root Hierarchies"} : {filteredHierarchyData?.children?.length || 0}
                  </span>
                </div>
              )}
              
              {searchTerm && searchResults > 0 && (
                <div className="bg-yellow-500 bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-200"
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
                  <span className="font-semibold">
                    Search Results: {searchResults}
                  </span>
                </div>
              )}
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
                    {role === "Admin" && (
                      <button
                        onClick={() => handleAddClick(null)}
                        className="bg-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Create Your First Hierarchy
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - File Operations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden top-8">
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
                <FileUploader onUploadSuccess={reloadHierarchy} role={role} />
              </div>
            </div>
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
          onSuccess={(parentId, newNode) =>
            handleNodeAddSuccess(parentId, newNode)
          }
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
          onSuccess={(nodeId) => handleNodeDeleteSuccess(nodeId)}
        />
      )}
    </main>
  );
};

export default Home;