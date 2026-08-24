export const runtime = "nodejs";

import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const { ok, retryAfterMs } = rateLimit(`parse-resume:${ip}`, { limit: 15, windowMs: 60_000 });
    if (!ok) {
      return Response.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

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
    let photo = null;

    const PDF_HELP =
      "We couldn't pull any readable text from this PDF. This usually happens when the PDF is a scanned image, a photo, or was exported oddly. Please try one of these: (1) Open the resume in Word/Google Docs and re-export it as a new PDF, (2) upload the original DOCX or TXT file instead, or (3) if it's a scanned document, use an OCR tool to make the text selectable first.";

    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const { default: pdfParse } = await import("pdf-parse");
      try {
        const result = await pdfParse(buffer);
        text = result.text;
      } catch (pdfErr) {
        console.error("pdf-parse error:", pdfErr);
        return Response.json(
          {
            error:
              "This PDF couldn't be opened (it may be password-protected, corrupted, or not a real PDF file). Please try re-saving/re-exporting it as a new PDF, or upload a DOCX or TXT version instead.",
          },
          { status: 422 }
        );
      }
      if (!text.trim()) {
        return Response.json({ error: PDF_HELP }, { status: 422 });
      }
    } else if (
      name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const mammoth = await import("mammoth");
        // Grab the first embedded image (typically the profile photo) as a data URL.
        const imageConverter = mammoth.images.imgElement(async (image) => {
          if (!photo) {
            const base64 = await image.read("base64");
            photo = `data:${image.contentType};base64,${base64}`;
          }
          return {};
        });
        const result = await mammoth.extractRawText({ buffer });
        await mammoth.convertToHtml({ buffer }, { convertImage: imageConverter });
        text = result.value;
      } catch (docxErr) {
        console.error("mammoth error:", docxErr);
        return Response.json(
          {
            error:
              "This DOCX file couldn't be opened (it may be corrupted or not a real Word file). Please try re-saving it from Word/Google Docs, or upload a PDF or TXT version instead.",
          },
          { status: 422 }
        );
      }
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
        {
          error:
            "Could not find any readable text in this file. Please double-check it actually contains your resume content, then try re-saving it as a new PDF/DOCX/TXT and upload again.",
        },
        { status: 422 }
      );
    }

    return Response.json({ text, photo });

  } catch (err) {
    console.error("parse-resume error:", err);
    return Response.json(
      { error: "Failed to parse the uploaded file." },
      { status: 500 }
    );
  }
}
