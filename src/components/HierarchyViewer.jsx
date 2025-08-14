import React from "react";
import NodeItem from "./NodeItem";

const HierarchyViewer = ({ data, onAdd, onDelete, onUpdate, onAddHierarchy }) => {
  return (
    <section className="w-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Asset Hierarchy
        </h2>
        <button
          onClick={() => onAddHierarchy(null)} // Pass null to indicate top-level
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
        >
          Add New Hierarchy
        </button>
      </div>

      <div className="space-y-4">
        {data?.children?.length > 0 ? (
          data.children.map((child) => (
            <NodeItem
              key={child.id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm italic">
            No hierarchy data available to display.
          </div>
        )}
      </div>
    </section>
  );
};

export default HierarchyViewer;
