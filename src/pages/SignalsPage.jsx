import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSignalsByAsset, deleteSignal ,calculateAverage } from "../utils/api.js";
import AddSignalModal from "../components/AddSignalModal";
import { toast } from "react-toastify";
import { IoArrowBack, IoAdd, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { startConnection, getConnection } from "../utils/signalr";

const SignalsPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSignal, setEditingSignal] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [avgRes, setAvgRes] = useState(null);

  // Mock node info - you might want to pass this via route state or fetch it
  useEffect(() => {
    // You can get node info from navigation state or fetch it separately\
    const initSignalR = async () => {
      const conn = await startConnection();
      if (conn) {
        conn.off("ReceiveAverageResult");
        conn.on("ReceiveAverageResult", ({ signalId, average }) => {
        console.log(`Average for Signal ${signalId}: ${average}`);
        toast.success(`Average for Signal ${signalId}: ${average}`);

       setAvgRes((prev) => ({
    ...prev,
    [signalId]: average,
  }));
});

      }
    };
    const state = history.state?.nodeInfo;
    if (state) {
      setNodeInfo(state);
    } else {
      setNodeInfo({ id: assetId, name: `Asset ${assetId}` });
    }
    initSignalR();

    return () => {
      const conn = getConnection();
      if (conn) {
        conn.off("ReceiveAverageResult");
        conn.stop();
      }
    };
  }, [assetId]);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const data = await getSignalsByAsset(assetId);
      setSignals(data);
    } catch (error) {
      toast.error("Failed to load signals");
      console.error("Error loading signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSignal = () => {
    setEditingSignal(null);
    setShowAddModal(true);
  };

  const handleEditSignal = (signal) => {
    setEditingSignal(signal);
    setShowAddModal(true);
  };

  const handleDeleteSignal = async (signal) => {
    if (
      window.confirm(`Are you sure you want to delete signal "${signal.name}"?`)
    ) {
      try {
        await deleteSignal(signal.id);
        toast.success("Signal deleted successfully!");
        loadSignals(); // Reload signals
      } catch (error) {
        toast.error("Failed to delete signal");
        console.error("Error deleting signal:", error);
      }
    }
  };

  const handleModalSuccess = () => {
    loadSignals(); // Reload signals after add/update
  };

  useEffect(() => {
    loadSignals();
  }, [assetId]);

  const getValueTypeColor = (valueType) => {
    const colors = {
      String: "bg-blue-100 text-blue-800 border-blue-200",
      Int: "bg-green-100 text-green-800 border-green-200",
      Real: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[valueType] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
  {/* Header */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white hover:bg-opacity-20 hover:text-blue-600 rounded-lg transition-all duration-200"
          >
            <IoArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Signals for {nodeInfo?.name}
            </h1>
            <p className="text-blue-100 mt-1">
              Manage signals and their configurations
            </p>
          </div>
        </div>
        <button
          onClick={handleAddSignal}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-blue-600 font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <IoAdd size={20} />
          Add Signal
        </button>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading signals...</p>
          </div>
        </div>
      ) : signals.length > 0 ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <IoSettingsOutline className="text-blue-600" />
              Signals ({signals.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {signal.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getValueTypeColor(
                          signal.valueType
                        )}`}
                      >
                        {signal.valueType}
                      </span>
                    </div>
                    {signal.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {signal.description}
                      </p>
                    )}

                    {avgRes?.[signal.id] && (
                      <p className="text-sm text-indigo-600 font-medium mt-2">
                        Average Value: {avgRes[signal.id]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditSignal(signal)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Edit signal"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSignal(signal)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Delete signal"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                    {/*   New Button: Calculate Average */}
                    <button
                      onClick={() => calculateAverage(signal.id)}
                      className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Calculate Average"
                    >
                      ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <IoSettingsOutline className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            No Signals Found
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            This asset doesn't have any signals yet. Create your first signal to
            get started.
          </p>
          <button
            onClick={handleAddSignal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Create First Signal
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Add/Edit Signal Modal */}
  {showAddModal && (
    <AddSignalModal
      node={nodeInfo}
      onClose={() => {
        setShowAddModal(false);
        setEditingSignal(null);
      }}
      onSuccess={handleModalSuccess}
      editingSignal={editingSignal}
    />
  )}
</div>

  );
};

export default SignalsPage;
