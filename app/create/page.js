"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import { emptyResume } from "@/lib/defaultResume";
import { RESUME_TEMPLATES } from "@/lib/resumeTemplates";

const STORAGE_KEY = "atsResumeBuilder:create";

export default function CreatePage() {
  const [template, setTemplate] = useState(undefined);
  const [data, setData] = useState(emptyResume());
  const [hydrated, setHydrated] = useState(false);

  // Restore in-progress work so a refresh doesn't wipe out the user's form.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData({ ...emptyResume(), ...parsed.data });
        if (parsed.started) setTemplate(parsed.templateId || "blank");
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
        JSON.stringify({ started: template !== undefined, templateId: template, data })
      );
    } catch {
      // Storage may be full or disabled; not critical to persist.
    }
  }, [template, data, hydrated]);

  function chooseTemplate(t) {
    setTemplate(t?.id ?? "blank");
    setData(t ? t.build() : emptyResume());
  }

  if (template === undefined) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
            &larr; Back
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Choose a Template</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pick the option that matches your situation. Every template is fully editable and
            exports the same ATS-friendly layout.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RESUME_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => chooseTemplate(t)}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <span className="text-3xl">{t.icon}</span>
                <span className="mt-3 text-base font-semibold text-slate-900">{t.name}</span>
                <span className="mt-1 text-sm text-slate-500">{t.description}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => chooseTemplate(null)}
            className="mt-6 text-sm font-medium text-slate-500 hover:text-blue-700 hover:underline"
          >
            Or start with a blank resume &rarr;
          </button>
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
            <button
              type="button"
              onClick={() => setTemplate(undefined)}
              className="mt-1 text-xs font-medium text-slate-500 hover:text-blue-700 hover:underline"
            >
              &larr; Choose a different template
            </button>
          </div>
          <DownloadButton data={data} requireExperienceAndProjects={template !== "fresh-grad"} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ResumeForm data={data} onChange={setData} templateId={template} showFreshGradSections={template === "fresh-grad"} />
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
