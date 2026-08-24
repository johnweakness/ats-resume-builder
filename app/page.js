import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl text-center">
        <Image
          src="/logo.svg"
          alt="ATS Resume Builder logo"
          width={56}
          height={56}
          className="mx-auto rounded-xl"
          priority
        />
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">ATS Resume Builder</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          Build a clean, ATS-friendly resume in minutes. No sign-up, no credits.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/create"
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <div className="text-3xl">📝</div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Create from Scratch</h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill in a simple form and get a polished, ATS-ready resume instantly.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-blue-700 group-hover:underline">
              Start building &rarr;
            </span>
          </Link>

          <Link
            href="/optimize"
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <div className="text-3xl">✨</div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Optimize Existing</h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload your resume and a job description to tailor your content with AI.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-blue-700 group-hover:underline">
              Optimize now &rarr;
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
