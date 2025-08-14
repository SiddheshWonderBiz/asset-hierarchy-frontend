import React from "react";
import { uploadHierarchyData, downloadHierarchyData } from "../utils/api";
import { toast } from "react-toastify";

const FileUploader = ({ onUploadSuccess }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadHierarchyData(file); 
      toast.success("File uploaded successfully.");
      onUploadSuccess();
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error(error.message);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadHierarchyData();

      const contentType = blob.type;
      const extension =
        contentType.includes("xml") ? "xml" : "json";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Hierarchy.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded successfully.");
    } catch (error) {
      console.error("Download failed:", error);
      const errMsg = error.response?.data || "Unexpected error occurred.";
      toast.error(`Error downloading file: ${errMsg}`);
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Import/Export JSON/XML Hierarchy
      </label>

      <div className="flex flex-col md:flex-row items-stretch gap-4">
        {/* Upload Section */}
        <div className="flex-1">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-400 text-gray-950 transition-colors duration-200 ease-in-out p-4 shadow-md h-20"
          >
            <svg
              className="w-5 h-5 mb-1 text-gray-950"
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
            <p className="text-xs text-gray-950 text-center">
              <span className="font-semibold">Upload JSON/XML</span>
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".json,.xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Download Button */}
        <div className="flex-1">
          <button
            onClick={handleDownload}
            className="w-full bg-green-500 text-white px-4 py-4 rounded-lg shadow hover:bg-green-600 transition h-20 flex items-center justify-center text-xs font-semibold"
          >
            Download JSON
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default FileUploader;
