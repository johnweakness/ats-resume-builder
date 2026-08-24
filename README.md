# ATS Resume Builder

A direct, no-sign-up ATS resume builder. Built with Next.js (App Router), Tailwind CSS, and the Gemini API.

## Features

1. **Create from Scratch** — choose from 4 ready-to-fill ATS templates (Fresh Graduate, OJT/Intern, Fresh Grad Working Student, Experienced Professional) or start blank, edit in a live-preview form, and export a text-based ATS-friendly PDF.
2. **Optimize Existing** — drag-and-drop your current resume (PDF/DOCX/TXT), enter a target job role and job description; Gemini tailors your content to the role, then you can review/edit before downloading. Embedded photos in `.docx` uploads carry over automatically.
3. **Optional profile photo** — upload a photo in the form, shown in both the live preview and the exported PDF.

## Tech stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS
- Next.js API routes (`/api/parse-resume`, `/api/optimize`), with basic in-memory per-IP rate limiting and input size limits
- `@google/genai` (Gemini, model `gemini-2.5-flash`) for optimization
- `@react-pdf/renderer` for real, selectable/parsable PDF text output (not a rasterized image)
- `pdf-parse` / `mammoth` to extract text (and embedded photos from `.docx`) from uploaded resumes

## Getting started

```bash
npm install
cp .env.local.example .env.local
# add your Gemini API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com/apikey). Used server-side only in `/api/optimize`. |

## Project structure

```
app/
  page.js              Home page (Create / Optimize)
  create/page.js        Template picker + resume builder form + live preview
  optimize/page.js       Upload resume + job role/JD, call Gemini, edit + download
  api/
    parse-resume/route.js  Extracts text (and .docx photo) from uploaded PDF/DOCX/TXT
    optimize/route.js      Calls Gemini to tailor resume content to a role + JD
components/
  ResumeForm.jsx        Shared editable form incl. photo upload (used by both pages)
  ResumePreview.jsx      Tailwind on-screen preview
  FileDropzone.jsx       Drag-and-drop upload input
  DownloadButton.jsx     Generates and downloads the PDF
  Spinner.jsx            Loading indicator
lib/
  defaultResume.js       Empty/sample resume data + normalization helper
  resumeTemplates.js     Fresh Grad / OJT / Working Student / Experienced templates
  resumePdf.js           @react-pdf/renderer document definition (PDF export)
  rateLimit.js           In-memory per-IP rate limiter for API routes
```

## Known limitations

- Rate limiting is in-memory per server instance — fine for basic abuse protection on a single deployment, but not distributed-safe across multiple serverless instances. For heavier public traffic, swap in a shared store (e.g. Vercel KV/Upstash Redis).
- Photo extraction from uploaded resumes only works for `.docx` files (via embedded image), not `.pdf`.
- No automated test suite yet; changes are verified via `npm run build` and manual testing.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the `GEMINI_API_KEY` environment variable in the Vercel project settings.
4. Deploy.

