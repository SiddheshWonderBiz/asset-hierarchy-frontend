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
      throw new Error(`Add node failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding node:", error);
    throw error;
  }
};

export const deleteNode = async (nodeId) => {
    try {
        const response = await fetch(`/api/Hierarchy/remove/${nodeId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Delete node failed: ${response.status}`);
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

  const response = await fetch("api/Hierarchy/upload", {
    method: "POST",
    body: formData, 
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return await response.text(); // or response.json() if your backend returns JSON
}


export const downloadHierarchyData = async () => {
  const response = await fetch("api/Hierarchy/download");

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  return blob;
};
