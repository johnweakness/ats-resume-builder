export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file was uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "File is too large (max 5MB)." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const name = (file.name || "").toLowerCase();

    let text = "";

    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const { default: pdfParse } = await import("pdf-parse");
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (
      name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".txt") || file.type === "text/plain") {
      text = buffer.toString("utf-8");
    } else {
      return Response.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    text = text.trim();

    if (!text) {
      return Response.json(
        { error: "Could not extract any text from this file." },
        { status: 422 }
      );
    }

    return Response.json({ text });
  } catch (err) {
    console.error("parse-resume error:", err);
    return Response.json(
      { error: "Failed to parse the uploaded file." },
      { status: 500 }
    );
  }
}
