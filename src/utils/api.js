import axios from "axios";

// ------------------ Axios Instance ------------------
const axiosInstance = axios.create({
  baseURL: "https://localhost:7092/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ send cookies with every request
});

// ------------------ Auth API ------------------
export const login = async (identifier, password) => {
  try {
    const { data } = await axiosInstance.post("/Auth/login", {
      username: identifier,
      userEmail: identifier,
      password,
    });
    return data.message; // backend only returns { message: "Login successful" }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    console.error("Login error:", message);
    throw new Error(message);
  }
};
// ------------------Avgerage Calculation API ------------------
export const calculateAverage = async (colname) => {
  try {
    const { data } = await axiosInstance.post(
      `/Calculation/avg?colname=${encodeURIComponent(colname)}`
    );
    return data; // backend returns { message: "Calculation for X queued" }
  } catch (error) { 
    const message =
      error.response?.data?.message || error.message || "Calculation failed";
    console.error("Calculation error:", message);   
    throw new Error(message);
  }
};


export const signup = async (username, email, password) => {
  try {
    const { data } = await axiosInstance.post("/Auth/signup", {
      username,
      userEmail: email,
      password,
      role: "Viewer",
    });
    return data.message;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Signup failed";
    console.error("Signup error:", message);
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const { data } = await axiosInstance.post("/Auth/logout");
    return data.message;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Logout failed";
    console.error("Logout error:", message);
    throw new Error(message);
  }
};

export const fetchCurrentUser = async () => {
  try {
    const { data } = await axiosInstance.get("/Auth/me");
    
    return data; // { username, email, role }
    
  } catch {
    return null; // not logged in
  }
};


// ------------------ HIERARCHY REORDER ------------------
export const reorderNode = async (nodeId, newParentId) => {
  try {
    const { data } = await axiosInstance.post("/Hierarchy/reorder", {
      nodeId,
      newParentId,
    });
    return data.message;
  } catch (error) {
    console.error("Error reordering node:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error occurred";
    throw new Error(message);
  }
};

// ------------------ HIERARCHY API ------------------
export const fetchHierarchyData = async () => {
  try {
    const { data } = await axiosInstance.get("/Hierarchy");
    return data;
  } catch (error) {
    console.error("Error fetching hierarchy data:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const fetchlogs = async () => {
  try {
    const { data } = await axiosInstance.get("/Hierarchy/logs");
    return data;
  } catch (error) {
    console.error("Error fetching logs data:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const addNode = async (parentId, newNode) => {
  try {
    const { data } = await axiosInstance.post(
      `/Hierarchy/add?parentId=${parentId}`,
      newNode
    );
    return data;
  } catch (error) {
    console.error("Error adding node:", error.response?.data);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error occurred";
    throw new Error(message);
  }
};

export const addHierarchy = async (newHierarchy) => {
  try {
    const { data } = await axiosInstance.post("/Hierarchy/addhierarchy", newHierarchy);
    return data;
  } catch (error) {
    console.error("Error adding hierarchy:", error.response?.data);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error occurred";
    throw new Error(message);
  }
};

export const deleteNode = async (nodeId) => {
  try {
    const { data } = await axiosInstance.delete(`/Hierarchy/remove/${nodeId}`);
    return data;
  } catch (error) {
    console.error("Error deleting node:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const uploadHierarchyData = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post("/Hierarchy/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const downloadHierarchyData = async () => {
  try {
    const { data } = await axiosInstance.get("/Hierarchy/download", {
      responseType: "blob",
    });
    return data;
  } catch (error) {
    console.error("Download failed:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const updateNode = async (Id, Name) => {
  try {
    const { data } = await axiosInstance.put(`/Hierarchy/update/${Id}`, Name);
    return data;
  } catch (error) {
    console.error("Error updating node:", error.response?.data);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error occurred";
    throw new Error(message);
  }
};

// ------------------ SIGNALS API ------------------
export const getSignalsByAsset = async (assetId) => {
  try {
    const { data } = await axiosInstance.get(`/Signals/asset/${assetId}`);
    return data || [];
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Error fetching signals by asset:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const getSignalById = async (signalId) => {
  try {
    const { data } = await axiosInstance.get(`/Signals/signals/${signalId}`);
    return data;
  } catch (error) {
    console.error("Error fetching signal by ID:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const addSignal = async (assetId, signalData) => {
  try {
    const { data } = await axiosInstance.post(`/Signals/asset/${assetId}/add`, signalData);
    return data;
  } catch (error) {
    console.error("Error adding signal:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};

export const updateSignal = async (assetId, signalId, signalData) => {
  try {
    const payload = {
      name: signalData.name,
      valueType: signalData.valueType,
      description: signalData.description || ""
    };
    const { data } = await axiosInstance.put(
      `/Signals/${signalId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Error updating signal:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};


export const deleteSignal = async (signalId) => {
  try {
    const { data } = await axiosInstance.delete(`/Signals/${signalId}`);
    return data;
  } catch (error) {
    console.error("Error deleting signal:", error.response?.data || error.message);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;
    throw new Error(message);
  }
};
