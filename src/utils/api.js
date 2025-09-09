import axios from "axios";
import { jwtDecode } from "jwt-decode";

// ------------------ Auth Token Helpers ------------------
export const setAuthToken = (token) => {
  if (typeof token === "string") {
    localStorage.setItem("authToken", token);
  } else {
    console.error("Invalid token format:", token);
  }
};

export const getAuthToken = () => localStorage.getItem("authToken");

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  const token = getAuthToken();
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const userRole = () => {
  const user = getUserFromToken();
  if (!user) return null;
  return (
    user.role ||
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null
  );
};

// ------------------ Axios Instance ------------------
const axiosInstance = axios.create({
  baseURL: "https://localhost:7092/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add interceptor to attach token for hierarchy endpoints
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (
    token &&
    (config.url?.startsWith("/Hierarchy") ||
     config.url?.startsWith("/Signals"))
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ------------------ Login ------------------
export const login = async (username, password) => {
  try {
    const { data } = await axiosInstance.post("/Auth/login", {
      username,
      password,
    });
    setAuthToken(data.token);
    setTimeout(() => debugToken(), 100);
    return data;
  } catch (error) {
     const message = error.response?.data?.message || error.message || "Login failed";
    console.error("Login error:", message);
    throw new Error(message);  // throw with a clean message
  }
};

// ------------------ Signup ------------------
export const signup = async (username, password) => {
  try {
    const { data } = await axiosInstance.post("/Auth/signup", {
      username,
      password,
      role: "Viewer",
    });
    return data.message;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Singup failed";
    console.error("Signup error:", message);
    throw new Error(message);  //
  }
};

// ------------------ HIERARCHY API ------------------
export const fetchHierarchyData = async () => {
  try {
    const { data } = await axiosInstance.get("/Hierarchy");
    return data;
  } catch (error) {
    console.error(
      "Error fetching hierarchy data:",
      error.response?.data || error.message
    );
    const message = error.response?.data?.message ||   error.response?.data?.error  || error.message;
    throw new Error(message);
  }
};
export const fetchlogs = async () => {
  try{
      const { data } = await axiosInstance.get("/Hierarchy/logs");
      return data;
  }catch (error) {
    console.error(
      "Error fetching logs data:",
      error.response?.data || error.message
    );
    const message = error.response?.data?.message ||   error.response?.data?.error  || error.message;
    throw new Error(message);
  }
}

export const addNode = async (parentId, newNode) => {
  try {
    const { data } = await axiosInstance.post(
      `/Hierarchy/add?parentId=${parentId}`,
      newNode
    );
    return data;
  } catch (error) {
    console.error("Error adding node:", error.response?.data);
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error occurred";
    throw new Error(message);
  }
};

export const addHierarchy = async (newHierarchy) => {
  try {
    const { data } = await axiosInstance.post(
      "/Hierarchy/addhierarchy",
      newHierarchy
    );
    return data;
  } catch (error) {
    console.error(
      "Error adding hierarchy:",
      error.response?.data || error.message
    );
    const message = error.response?.data?.message||  error.response?.data?.error  || error.message;
    throw new Error(message);
  }
};

export const deleteNode = async (nodeId) => {
  try {
    const { data } = await axiosInstance.delete(`/Hierarchy/remove/${nodeId}`);
    return data;
  } catch (error) {
    console.error(
      "Error deleting node:",
      error.response?.data || error.message
    );
    const message = error.response?.data?.message|| error.response?.data?.error  || error.message;
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
    const message = error.response?.data?.message|| error.response?.data?.error  || error.message;
    throw new Error(message);
  }
};
// export const uploadHierarchyData = async (file) => {
//   try {
//     console.log("1");
//     const formData = new FormData();
//     formData.append("file", file);
//     console.log("2");

//     const token = getAuthToken();
//     console.log("3",token);

//     // Do NOT set Content-Type manually, only Authorization
//     const resp = await axios.post("/api/Hierarchy/upload", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
        
//       },
//       maxBodyLength: Infinity, // in case file is large
//     });
//         console.log("4",resp);


//     console.log("Upload successful:", resp.data);
//     return resp.data;
//   } catch (error) {
//     console.error("Upload error:", error.response?.data || error.message);
//     throw error;
//   }
// };



export const downloadHierarchyData = async () => {
  try {
    const { data } = await axiosInstance.get("/Hierarchy/download", {
      responseType: "blob",
    });
    return data;
  } catch (error) {
    console.error("Download failed:", error.response?.data || error.message);
   const message = error.response?.data?.message|| error.response?.data?.error  || error.message;
    throw new Error(message);
  }
};

export const updateNode = async (Id, Name) => {
  try {
    const { data } = await axiosInstance.put(`/Hierarchy/update/${Id}`, Name);
    return data;
  } catch (error) {
    console.error("Error updating node:", error.response?.data);
   const message = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error occurred";
    throw new Error(message);
  }
};

// ------------------ SIGNALS API (NO AUTH REQUIRED) ------------------
export const getSignalsByAsset = async (assetId) => {
  try {
    const { data } = await axiosInstance.get(`/Signals/asset/${assetId}`);
    return data;
  } catch (error) {
    console.error("Error fetching signals by asset:", error.response?.data || error.message);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

export const getSignalById = async (assetId, signalId) => {
  try {
    const { data } = await axiosInstance.get(`/Signals/asset/${assetId}/signals/${signalId}`);
    return data;
  } catch (error) {
    console.error("Error fetching signal by ID:", error.response?.data || error.message);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

export const addSignal = async (assetId, signalData) => {
  try {
    const { data } = await axiosInstance.post(`/Signals/asset/${assetId}/Addsignal`, signalData);
    return data;
  } catch (error) {
    console.error("Error adding signal:", error.response?.data || error.message);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

export const updateSignal = async (assetId, signalId, signalData) => {
  try {
    const { data } = await axiosInstance.put(`/Signals/asset/${assetId}/${signalId}`, signalData);
    return data;
  } catch (error) {
    console.error("Error updating signal:", error.response?.data || error.message);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
};

export const deleteSignal = async (assetId, signalId) => {
  try {
    const { data } = await axiosInstance.delete(`/Signals/asset/${assetId}/${signalId}`);
    return data;
  } catch (error) {
    console.error("Error deleting signal:", error.response?.data || error.message);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(message);
  }
};


// ------------------ Debug Token ------------------
export const debugToken = () => {
  const token = getAuthToken();
  console.log("=== TOKEN DEBUG ===");
  console.log("Token exists:", !!token);
  if (!token) return;
  console.log("Token expired:", isTokenExpired());
  try {
    const decoded = jwtDecode(token);
    console.log("Full payload:", decoded);
    console.log("Username:", decoded.username || decoded.name);
    console.log("Role:", decoded.role);
    console.log("Expires:", new Date(decoded.exp * 1000));
  } catch (err) {
    console.error("Invalid token:", err);
  }
};
