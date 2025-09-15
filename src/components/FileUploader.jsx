import React from "react";
import { uploadHierarchyData, downloadHierarchyData } from "../utils/api";
import { toast } from "react-toastify";

const FileUploader = ({ onUploadSuccess , role }) => {
  const isAdmin = role === "Admin";
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
      const extension = contentType.includes("xml") ? "xml" : "json";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Hierarchy.${extension}`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("File downloaded successfully.");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Error downloading file:` , error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4M21 16V4m0 0l-4 4m4-4l4 4M5 20h14"/>
          </svg>
          {isAdmin ? ("Import/Export") : ("Export") }
          
        </h3>
        <p className="text-sm text-gray-600">Upload or download hierarchy data</p>
      </div>

      <div className="space-y-4">
        {/* Upload Section */}
        {isAdmin &&(<div className="group">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-green-50 border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-all duration-300 ease-in-out p-4 shadow-sm hover:shadow-md"
          >
            <div className="flex flex-col items-center justify-center">
              
              <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors duration-300">
                Upload JSON File
              </p>
            
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".json,.xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>)}
        

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Download Hierarchy
        </button>
      </div>
    </div>
  );
};

export default FileUploader;