# ATS Resume Builder

A direct, no-sign-up ATS resume builder. Built with Next.js (App Router), Tailwind CSS, and the Gemini API.

## Features

1. **Create from Scratch** — a clean form with a live preview that produces a text-based, ATS-friendly PDF.
2. **Optimize Existing** — drag-and-drop your current resume (PDF/DOCX/TXT) and a job description; Gemini tailors your content to the role, then you can review/edit before downloading.

## Tech stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS
- Next.js API routes (`/api/parse-resume`, `/api/optimize`)
- `@google/generative-ai` (Gemini) for optimization
- `@react-pdf/renderer` for real, selectable/parsable PDF text output (not a rasterized image)
- `pdf-parse` / `mammoth` to extract text from uploaded resumes

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
  create/page.js        Resume builder form + live preview
  optimize/page.js       Upload resume + JD, call Gemini, edit + download
  api/
    parse-resume/route.js  Extracts text from uploaded PDF/DOCX/TXT
    optimize/route.js      Calls Gemini to tailor resume content to a JD
components/
  ResumeForm.jsx        Shared editable form (used by both pages)
  ResumePreview.jsx      Tailwind on-screen preview
  FileDropzone.jsx       Drag-and-drop upload input
  DownloadButton.jsx     Generates and downloads the PDF
  Spinner.jsx            Loading indicator
lib/
  defaultResume.js       Empty/sample resume data + normalization helper
  resumePdf.js           @react-pdf/renderer document definition (PDF export)
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the `GEMINI_API_KEY` environment variable in the Vercel project settings.
4. Deploy.
