import React from "react";

const FileUploader = ({ onDataParsed }) => {
  const HandleFileCahnge = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawData = JSON.parse(event.target.result);

        const normalizeKeys = (node) => ({
          id: node.Id,
          name: node.Name,
          children: (node.Children || []).map(normalizeKeys),
        });

        const normalizedData = normalizeKeys(rawData);
        onDataParsed(normalizedData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Import JSON Hierarchy
      </label>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 ease-in-out p-6"
        >
          <svg
            className="w-8 h-8 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16V4m0 0L3 8m4-4l4 4M21 16V4m0 0l-4 4m4-4l4 4M5 20h14"
            ></path>
          </svg>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">Only JSON files are supported</p>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={HandleFileCahnge}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
