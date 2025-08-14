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
