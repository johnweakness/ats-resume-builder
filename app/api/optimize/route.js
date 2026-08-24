import { GoogleGenAI, Type } from "@google/genai";

export const runtime = "nodejs";

// gemini-2.5-flash: current stable, cost-efficient model (see ai.google.dev/gemini-api/docs/models)
const MODEL = "gemini-2.5-flash";

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    jobTitle: { type: Type.STRING },
    location: { type: Type.STRING },
    phone: { type: Type.STRING },
    email: { type: Type.STRING },
    objective: { type: Type.STRING },
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
- If a target job role is provided, sets "jobTitle" to that role (or a close professional variant) and tailors the objective and bullets toward it
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

    const { resumeText, jobDescription, targetJobRole } = await request.json();

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return Response.json(
        { error: "Both the resume content and job description are required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `CANDIDATE RESUME:\n"""\n${resumeText}\n"""\n\n${
      targetJobRole?.trim() ? `TARGET JOB ROLE: ${targetJobRole.trim()}\n\n` : ""
    }TARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nRewrite and optimize the resume for this job description following the JSON schema.`;

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

    let optimized;
    try {
      optimized = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("Gemini returned non-JSON response:", responseText);
      return Response.json(
        { error: "The AI response could not be parsed. Please try again." },
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
