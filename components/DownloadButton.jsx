"use client";

import { useState } from "react";
import Spinner from "./Spinner";

export default function DownloadButton({ data, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setError("");
    setLoading(true);
    try {
      const { generateResumePdfBlob } = await import("@/lib/resumePdf");
      const blob = await generateResumePdfBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fileName = data.fullName ? data.fullName.trim().replace(/\s+/g, "_") : "resume";
      a.href = url;
      a.download = `${fileName}_ATS_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Could not generate the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {loading ? <Spinner className="h-4 w-4" /> : null}
        {loading ? "Preparing PDF..." : "Download PDF"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
