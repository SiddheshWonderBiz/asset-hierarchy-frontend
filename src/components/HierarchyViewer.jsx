import React from "react";
import NodeItem from "./NodeItem";

const HierarchyViewer = ({ data, onAdd, onDelete, onUpdate }) => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Asset Hierarchy
        </h2>
      </div>

      <div className="space-y-4">
        {data ? (
          <NodeItem
            node={data}
            onAdd={onAdd}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
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
