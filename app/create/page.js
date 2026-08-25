"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import { emptyResume } from "@/lib/defaultResume";

const STORAGE_KEY = "atsResumeBuilder:create";

export default function CreatePage() {
  const [data, setData] = useState(emptyResume());
  const [hydrated, setHydrated] = useState(false);

  // Restore in-progress work so a refresh doesn't wipe out the user's form.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData({ ...emptyResume(), ...parsed.data });
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

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
              &larr; Back
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Create from Scratch</h1>
          </div>
          <DownloadButton data={data} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ResumeForm data={data} onChange={setData} showAdditionalSections />
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
