"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FileDropzone from "@/components/FileDropzone";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import Spinner from "@/components/Spinner";
import { normalizeResume } from "@/lib/defaultResume";

const STORAGE_KEY = "atsResumeBuilder:optimize";

export default function OptimizePage() {
  const [file, setFile] = useState(null);
  const [targetJobRole, setTargetJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore in-progress work so a refresh doesn't wipe out the user's form.
  // Note: the uploaded file itself can't be persisted, so it must be re-selected.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.targetJobRole) setTargetJobRole(parsed.targetJobRole);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
        if (parsed.resume) setResume(parsed.resume);
      }
    } catch {
      // Ignore corrupt/unavailable storage and start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ targetJobRole, jobDescription, resume })
      );
    } catch {
      // Storage may be full or disabled; not critical to persist.
    }
  }, [targetJobRole, jobDescription, resume, hydrated]);

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error(
          "This is taking longer than usual, possibly due to a slow connection. Please try again."
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

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
    setSlowNotice(false);
    const slowTimer = setTimeout(() => setSlowNotice(true), 8000);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetchWithTimeout(
        "/api/parse-resume",
        { method: "POST", body: formData },
        30_000
      );
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error || "Failed to read the resume file.");

      const optimizeRes = await fetchWithTimeout(
        "/api/optimize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: parseData.text, jobDescription, targetJobRole }),
        },
        45_000
      );
      const optimizeData = await optimizeRes.json();
      if (!optimizeRes.ok) throw new Error(optimizeData.error || "Failed to optimize the resume.");

      const normalized = normalizeResume(optimizeData.resume);
      if (parseData.photo) normalized.photo = parseData.photo;
      setResume(normalized);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      setSlowNotice(false);
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

            {error ? (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <span className="text-xl leading-none">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    We couldn't process your file
                  </p>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            ) : null}

            {loading && slowNotice ? (
              <p className="text-sm text-slate-500">
                Still working — this can take a bit longer on a slower connection or with a longer
                resume/job description. No need to refresh, just hang tight.
              </p>
            ) : null}

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
                onClick={() => {
                  setResume(null);
                  setFile(null);
                }}
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
