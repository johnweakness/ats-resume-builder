import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const runtime = "nodejs";

const resumeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    fullName: { type: SchemaType.STRING },
    jobTitle: { type: SchemaType.STRING },
    location: { type: SchemaType.STRING },
    phone: { type: SchemaType.STRING },
    email: { type: SchemaType.STRING },
    objective: { type: SchemaType.STRING },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          degree: { type: SchemaType.STRING },
          school: { type: SchemaType.STRING },
          location: { type: SchemaType.STRING },
          startDate: { type: SchemaType.STRING },
          endDate: { type: SchemaType.STRING },
        },
      },
    },
    experienceHeading: { type: SchemaType.STRING },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING },
          link: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING },
          bullets: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
      },
    },
    skills: { type: SchemaType.STRING },
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

    const { resumeText, jobDescription } = await request.json();

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return Response.json(
        { error: "Both the resume content and job description are required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const prompt = `CANDIDATE RESUME:\n"""\n${resumeText}\n"""\n\nTARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nRewrite and optimize the resume for this job description following the JSON schema.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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
