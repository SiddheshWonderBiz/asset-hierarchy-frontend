import React, { useState } from "react";
import AddNodeModal from "./AddNodeModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { addNode, deleteNode } from "../utils/api";

const NodeItem = ({ node, onUpdate, onAdd, onDelete }) => {
  return (
    <div className="ml-4 mt-2 border-l border-gray-300 pl-4">
      <div className="flex items-center justify-between">
        <span className="font-mono">{node.id}:{node.name}</span>
        <div className="space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => onAdd(node)}  
          >
            Add
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => onDelete(node)} 
          >
            Delete
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


