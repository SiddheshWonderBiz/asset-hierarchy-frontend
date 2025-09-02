import { jwtDecode } from "jwt-decode";

// ------------------ Auth Token Helpers ------------------
export const setAuthToken = (token) => {
  if (typeof token === "string") {
    localStorage.setItem("authToken", token);
  } else {
    console.error("Invalid token format:", token);
  }

  console.log("Stored token :))))))))))))))", localStorage.getItem("authToken"));
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
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
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const userRole = () => {
  const user = getUserFromToken();
  if (!user) return null;
  
  // .NET JWT uses full claim URIs
  return user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
         user.role || 
         null;
};

// Debug function to help troubleshoot
export const debugToken = () => {
  const token = getAuthToken();
  console.log("=== TOKEN DEBUG ===");
  console.log("Token exists:", !!token);
  
  if (!token) {
    console.log("No token found - user needs to login");
    return;
  }
  
  console.log("Token expired:", isTokenExpired());
  
  try {
    const decoded = jwtDecode(token);
    console.log("Full token payload:", decoded);
    console.log("Username:", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.name);
    console.log("Role:", decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role);
    console.log("Expires:", new Date(decoded.exp * 1000));
  } catch (error) {
    console.log("Invalid token:", error);
  }
};

// ------------------ Auth Fetch Wrapper ------------------
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  // Check if token exists
  if (!token) {
    throw new Error('No authentication token - please login');
  }
  
  // Check if token is expired
  if (isTokenExpired()) {
    removeAuthToken();
    throw new Error('Token expired - please login again');
  }
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  console.log("Auth header:", headers.Authorization);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // removeAuthToken();
    throw new Error('Unauthorized - please login again');
  }

  return response;
};

// ------------------ Login ------------------
export const login = async (username, password) => {
  try {
    const response = await fetch('/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const data = await response.json();
    console.log("Login response data:", data);
    console.log("this is token",data.token);
    setAuthToken(data.token);

    console.log("Login successful. User role:", data.role);
    
    // Debug the token immediately after login
    setTimeout(() => debugToken(), 100);
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ------------------ Signup ------------------
export const signup = async (username, password) => {
  try {
    const response = await fetch('/api/Auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role: "Viewer" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Signup failed');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// ====================== HIERARCHY API ======================

export const fetchHierarchyData = async () => {
  try {
    const response = await fetch('/api/Hierarchy',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    throw error;
  }
};

export const addNode = async (parentId, newNode) => {
  try {
    const response = await authFetch(`/api/Hierarchy/add?parentId=${parentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNode),
    });

    if (!response.ok) {
      let errorMessage = `Add node failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding node:", error);
    throw error;
  }
};

export const addHierarchy = async (newHierarchy) => {
  try {
    const res = await authFetch("/api/Hierarchy/addhierarchy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHierarchy),
    });
    
    if (!res.ok) {
      let errorMessage = `Add hierarchy failed: ${res.status}`;
      try {
        const errData = await res.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error adding hierarchy:", error);
    throw error;
  }
};

export const deleteNode = async (nodeId) => {
  try {
    const response = await authFetch(`/api/Hierarchy/remove/${nodeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = `Delete node failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting node:", error);
    throw error;
  }
};

export async function uploadHierarchyData(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await authFetch("/api/Hierarchy/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Upload failed";
    try {
      const errData = await response.json();
      if (errData?.error) {
        errorMessage = errData.error;
      }
    } catch {
      // if backend didn't send JSON, keep default
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

export const downloadHierarchyData = async () => {
  const response = await authFetch("/api/Hierarchy/download");

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  return blob;
};

// FIXED: Now uses authFetch for proper authorization
export const updateNode = async (Id, Name) => {
  try {
    const response = await authFetch(`/api/Hierarchy/update/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Name),
    });

    if (!response.ok) {
      let errorMessage = `Update node failed: ${response.status}`;
      try {
        const errData = await response.text();
        if (errData) {
          errorMessage = errData;
        }
      } catch {
        // ignore if no text
      }
      throw new Error(errorMessage);
    }

    return await response.text();
  } catch (error) {
    console.error("Error updating node:", error);
    throw error;
  }
};

// ====================== SIGNALS API ======================

export const getSignalsByAsset = async (assetId) => {
  try {
    const response = await authFetch(`/api/Signals/asset/${assetId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching signals:", error);
    throw error;
  }
};

export const getSignalById = async (assetId, signalId) => {
  try {
    const response = await authFetch(`/api/Signals/asset/${assetId}/signals/${signalId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching signal:", error);
    throw error;
  }
};

export const addSignal = async (assetId, signalData) => {
  try {
    const response = await authFetch(`/api/Signals/asset/${assetId}/Addsignal/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signalData),
    });

    if (!response.ok) {
      let errorMessage = `Add signal failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding signal:", error);
    throw error;
  }
};

export const updateSignal = async (assetId, signalId, signalData) => {
  try {
    const response = await authFetch(`/api/Signals/asset/${assetId}/${signalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signalData),
    });

    if (!response.ok) {
      let errorMessage = `Update signal failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating signal:", error);
    throw error;
  }
};

export const deleteSignal = async (assetId, signalId) => {
  try {
    const response = await authFetch(`/api/Signals/asset/${assetId}/${signalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = `Delete signal failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error;
        }
      } catch {
        // ignore parsing errors
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting signal:", error);
    throw error;
  }
};