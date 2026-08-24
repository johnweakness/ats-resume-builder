import { GoogleGenAI, Type } from "@google/genai";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// gemini-2.5-flash: current stable, cost-efficient model (see ai.google.dev/gemini-api/docs/models)
const MODEL = "gemini-2.5-flash";
const MAX_RESUME_CHARS = 20_000;
const MAX_JOB_DESC_CHARS = 10_000;
const MAX_JOB_ROLE_CHARS = 200;

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    jobTitle: { type: Type.STRING },
    location: { type: Type.STRING },
    phone: { type: Type.STRING },
    email: { type: Type.STRING },
    objective: {
      type: Type.STRING,
      description:
        "A 2-3 sentence Professional Summary highlighting the candidate's skills, experience, and value to an employer (not a career-goal 'objective' statement).",
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
        },
      },
    },
    experienceHeading: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          role: { type: Type.STRING },
          link: { type: Type.STRING },
          date: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    skills: { type: Type.STRING },
  },
  required: ["fullName", "objective", "education", "experience", "skills"],
};

const SYSTEM_INSTRUCTION = `You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.
Given a candidate's existing resume text and a target job description, rewrite the resume content so that it:
- Naturally incorporates relevant keywords and phrasing from the job description
- Uses strong, quantifiable action verbs
- Keeps every bullet concise and truthful to the original experience (never invent employers, dates, or achievements)
- Preserves the candidate's real contact details, education, and project/experience entries
- Fits the exact JSON schema provided, with "skills" as a single string of skills separated by "; "
- Sets "experienceHeading" to "EXPERIENCE" or "PROJECTS" depending on what best matches the source resume
- Writes "objective" as a 2-3 sentence Professional Summary (not an "I am seeking..." objective statement): lead with the candidate's strongest skills/experience and value to an employer, tailored to the target job role
- Sets "jobTitle" to the given target job role (or a close professional variant) and tailors the summary and bullets toward it
Return only the structured data.`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "The server is missing a GEMINI_API_KEY. Add one to your environment variables." },
        { status: 500 }
      );
    }

    const ip = getClientIp(request);
    const { ok, retryAfterMs } = rateLimit(`optimize:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!ok) {
      return Response.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const { resumeText, jobDescription, targetJobRole } = await request.json();

    if (!resumeText?.trim() || !jobDescription?.trim() || !targetJobRole?.trim()) {
      return Response.json(
        { error: "The resume content, target job role, and job description are all required." },
        { status: 400 }
      );
    }

    if (
      resumeText.length > MAX_RESUME_CHARS ||
      jobDescription.length > MAX_JOB_DESC_CHARS ||
      targetJobRole.length > MAX_JOB_ROLE_CHARS
    ) {
      return Response.json(
        { error: "One of the inputs is too long. Please shorten your resume, job description, or job role." },
        { status: 413 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `CANDIDATE RESUME:\n"""\n${resumeText}\n"""\n\nTARGET JOB ROLE: ${targetJobRole.trim()}\n\nTARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nRewrite and optimize the resume for this job role and job description following the JSON schema.`;

    // Gemini occasionally returns a transient error or a truncated/non-JSON
    // response; retry a couple of times before surfacing a failure to the user.
    const MAX_ATTEMPTS = 3;
    let optimized;
    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: resumeSchema,
          },
        });
        const responseText = result.text;
        optimized = JSON.parse(responseText);
        lastError = null;
        break;
      } catch (attemptErr) {
        lastError = attemptErr;
        console.error(`optimize attempt ${attempt} failed:`, attemptErr);
      }
    }

    if (lastError) {
      return Response.json(
        { error: "The AI is having trouble right now. Please try again in a moment." },
        { status: 502 }
      );
    }

    return Response.json({ resume: optimized });
  } catch (err) {
    console.error("optimize error:", err);
    return Response.json(
      { error: "Failed to optimize the resume. Please try again." },
      { status: 500 }
    );
  }
}
