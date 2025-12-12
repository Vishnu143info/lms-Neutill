import React from "react";

export default function FileUploader({ label, onFileSelect }) {
  return (
    <div className="p-4 border bg-white rounded shadow max-w-md">
      <label className="font-semibold">{label}</label>
      <input
        type="file"
        className="mt-2"
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
    </div>
  );
}
