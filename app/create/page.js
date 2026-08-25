"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import { emptyExperience, emptyResume } from "@/lib/defaultResume";

const STORAGE_KEY = "atsResumeBuilder:create";

export default function CreatePage() {
  const [data, setData] = useState(emptyResume());
  const [resumeType, setResumeType] = useState(undefined);
  const [hydrated, setHydrated] = useState(false);

  // Restore in-progress work so a refresh doesn't wipe out the user's form.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          const restoredData = { ...emptyResume(), ...parsed.data };
          setData(restoredData);
          if (restoredData.resumeType) setResumeType(restoredData.resumeType);
        }
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
        JSON.stringify({ data })
      );
    } catch {
      // Storage may be full or disabled; not critical to persist.
    }
  }, [data, hydrated]);

  function chooseResumeType(type) {
    setResumeType(type);
    setData({
      ...emptyResume(),
      resumeType: type,
      experience: type === "with-experience" ? [emptyExperience()] : [],
    });
  }

  if (resumeType === undefined) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">&larr; Back</Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Create Your Resume</h1>
          <p className="mt-1 text-sm text-slate-500">Choose the option that best matches your work history.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <button type="button" onClick={() => chooseResumeType("no-experience")} className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="text-3xl">🎓</span>
              <span className="mt-3 block text-lg font-semibold text-slate-900">No Experience</span>
              <span className="mt-1 block text-sm text-slate-500">For fresh graduates, students, and applicants without formal work experience.</span>
            </button>
            <button type="button" onClick={() => chooseResumeType("with-experience")} className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="text-3xl">💼</span>
              <span className="mt-3 block text-lg font-semibold text-slate-900">With Experience</span>
              <span className="mt-1 block text-sm text-slate-500">For applicants with professional or relevant work experience.</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
              &larr; Back
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Create from Scratch</h1>
            <button type="button" onClick={() => setResumeType(undefined)} className="mt-1 text-xs font-medium text-slate-500 hover:text-blue-700 hover:underline">&larr; Change resume type</button>
          </div>
          <DownloadButton data={data} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ResumeForm data={data} onChange={setData} resumeType={resumeType} showAdditionalSections />
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Live Preview
            </p>
            <div className="overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
              <ResumePreview data={data} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
