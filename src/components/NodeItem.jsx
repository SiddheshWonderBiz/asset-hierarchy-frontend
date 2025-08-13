import React, { useState } from "react";

const NodeItem = ({ node, onUpdate, onAdd, onDelete }) => {
  return (
    <div className="ml-4 mt-2 border-l border-gray-300 pl-4">
      <div className="flex items-center ">
        <span className="font-mono">{node.id}:{node.name}</span>
        <div className="space-x-2 ml-3">
          <button
            className="bg-green-500 text-white py-0.5 px-2  rounded-full text-sm"
            onClick={() => onAdd(node)}  
          >
            +
          </button>
          <button
            className="bg-red-500 text-white py-0.5 px-2  rounded-full text-sm"
            onClick={() => onDelete(node)} 
          >
            -
          </button>
        </div>
      </div>

      {/* Render children */}
      {node.children?.map((child) => (
        <NodeItem
          key={child.id}
          node={child}
          onUpdate={onUpdate}
          onAdd={onAdd}     
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NodeItem;


