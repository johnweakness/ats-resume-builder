"use client";

import { useRef, useState } from "react";

const ACCEPTED = ".pdf,.docx,.txt";

export default function FileDropzone({ file, onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const selected = fileList?.[0];
    if (selected) onFileSelected(selected);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="text-3xl">📄</div>
      {file ? (
        <p className="mt-3 text-sm font-medium text-slate-700">{file.name}</p>
      ) : (
        <>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Drag & drop your resume here, or click to browse
          </p>
          <p className="mt-1 text-xs text-slate-400">PDF, DOCX, or TXT (max 5MB)</p>
        </>
      )}
    </div>
  );
}
