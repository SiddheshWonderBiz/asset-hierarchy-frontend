export const fetchHierarchyData = async () => {
    try {
        const response = await fetch('/api/Hierarchy');
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
    const response = await fetch(`/api/Hierarchy/add?parentId=${parentId}`, {
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
          errorMessage = errData.error; // get backend's friendly error
        }
      } catch {
        
      }
      throw new Error(errorMessage);
    }


    return await response.json();
  } catch (error) {
    console.error("Error adding node:", error);
    throw error;
  }
};

export const addHierarchy = async (newHierarchy) =>{
  try{
    const res = await fetch("/api/Hierarchy/addhierarchy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHierarchy),
    })
    if (!res.ok) {
      let errorMessage = `Add hierarchy failed: ${res.status}`;
      try {
        const errData = await res.json();
        if (errData?.error) {
          errorMessage = errData.error; // get backend's friendly error
        }
      } catch {
        
      }
      throw new Error(errorMessage);
    }
  }catch(error){
    console.error("Error adding hierarchy:", error);
    throw error;
  }
};

export const deleteNode = async (nodeId) => {
    try {
        const response = await fetch(`/api/Hierarchy/remove/${nodeId}`, {
            method: 'DELETE',
        });

                if (!response.ok) {
      let errorMessage = `Delete node failed: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData?.error) {
          errorMessage = errData.error; // get backend's friendly error
        }
      } catch {
        
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

  const response = await fetch("/api/Hierarchy/upload", {
    method: "POST",
    body: formData, 
  });

  if (!response.ok) {
    let errorMessage = "Upload failed";
    try {
      const errData = await response.json(); // try to read backend's error message
      if (errData?.error) {
        errorMessage = errData.error;
      }
    } catch {
      // if backend didn't send JSON, keep default
    }
    throw new Error(errorMessage);
  }

  return await response.json(); // backend sends JSON on success
}



export const downloadHierarchyData = async () => {
  const response = await fetch("api/Hierarchy/download");

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  return blob;
};

export const updateNode = async (Id, Name) => {
  try {
    const response = await fetch(`/api/Hierarchy/update/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Name), // send raw string e.g. "Pump"
    });

    if (!response.ok) {
      let errorMessage = `Update node failed: ${response.status}`;
      try {
        const errData = await response.text(); // backend sends string
        if (errData) {
          errorMessage = errData;
        }
      } catch {
        // ignore if no text
      }
      throw new Error(errorMessage);
    }

    return await response.text(); // get success message
  } catch (error) {
    console.error("Error updating node:", error);
    throw error;
  }
};
// ====================== SIGNALS API ======================

// Get all signals for an asset
export const getSignalsByAsset = async (assetId) => {
    try {
        const response = await fetch(`/api/Signals/asset/${assetId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching signals:", error);
        throw error;
    }
};

// Get a specific signal by ID
export const getSignalById = async (assetId, signalId) => {
    try {
        const response = await fetch(`/api/Signals/asset/${assetId}/signals/${signalId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching signal:", error);
        throw error;
    }
};

// Add a new signal to an asset
export const addSignal = async (assetId, signalData) => {
    try {
        const response = await fetch(`/api/Signals/asset/${assetId}/Addsignal/`, {
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

// Update an existing signal
export const updateSignal = async (assetId, signalId, signalData) => {
    try {
        const response = await fetch(`/api/Signals/asset/${assetId}/${signalId}`, {
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

// Delete a signal
export const deleteSignal = async (assetId, signalId) => {
    try {
        const response = await fetch(`/api/Signals/asset/${assetId}/${signalId}`, {
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
