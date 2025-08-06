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
export async function uploadHierarchyData(data) {
  const response = await fetch("api/Hierarchy/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }
}
