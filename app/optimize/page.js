"use client";

import { useState } from "react";
import Link from "next/link";
import FileDropzone from "@/components/FileDropzone";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import Spinner from "@/components/Spinner";
import { normalizeResume } from "@/lib/defaultResume";

export default function OptimizePage() {
  const [file, setFile] = useState(null);
  const [targetJobRole, setTargetJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);

  async function handleOptimize() {
    setError("");

    if (!file) {
      setError("Please upload your current resume file.");
      return;
    }
    if (!targetJobRole.trim()) {
      setError("Please enter the target job role.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the target job description.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error || "Failed to read the resume file.");

      const optimizeRes = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: parseData.text, jobDescription, targetJobRole }),
      });
      const optimizeData = await optimizeRes.json();
      if (!optimizeRes.ok) throw new Error(optimizeData.error || "Failed to optimize the resume.");

      const normalized = normalizeResume(optimizeData.resume);
      if (parseData.photo) normalized.photo = parseData.photo;
      setResume(normalized);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
              &larr; Back
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Optimize Existing</h1>
          </div>
          {resume ? <DownloadButton data={resume} /> : null}
        </div>

        {!resume ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your current resume
              </label>
              <FileDropzone file={file} onFileSelected={setFile} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Target job role
              </label>
              <input
                type="text"
                value={targetJobRole}
                onChange={(e) => setTargetJobRole(e.target.value)}
                placeholder="e.g. Software Engineer, Marketing Assistant"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Target job description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[220px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              onClick={handleOptimize}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Spinner className="h-4 w-4" /> : null}
              {loading ? "Optimizing your resume..." : "Optimize with AI"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ResumeForm data={resume} onChange={setResume} />
            <div className="lg:sticky lg:top-8 lg:self-start">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Live Preview
              </p>
              <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
                <ResumePreview data={resume} />
              </div>
              <button
                type="button"
                onClick={() => setResume(null)}
                className="mt-3 text-xs font-medium text-slate-500 hover:text-blue-700 hover:underline"
              >
                &larr; Start over with a different file
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
