import React from "react";

export default function MessageBox({ messages }) {
  return (
    <div className="p-4 border rounded bg-white shadow h-80 overflow-y-auto space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`p-2 rounded w-fit ${
            m.sender === "student" ? "bg-blue-200 ml-auto" : "bg-gray-200"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}
