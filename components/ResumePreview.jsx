"use client";

import { useEffect, useRef, useState } from "react";

// Standard A4 dimensions at 72dpi: 595.28 x 841.89 points
// Inside padding: top 40pt, bottom 40pt -> printable height = 761.89pt
// Width: 595.28pt, horizontal padding 48pt each side
export default function ResumePreview({ data }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [pages, setPages] = useState(1);

  const {
    fullName,
    jobTitle,
    location,
    phone,
    email,
    photo,
    objective,
    education = [],
    experience = [],
    projects = [],
    skills,
  } = data;

  const contactLine = [location, phone, email].filter(Boolean).join("   |   ");

  // Recalculate page count based on A4 printable height (1122.5px at 96dpi standard screen)
  // A4 = 210mm x 297mm (aspect ratio 1 : 1.4142). In pixels at 794x1123.
  useEffect(() => {
    if (!contentRef.current) return;
    const contentHeight = contentRef.current.scrollHeight;
    // Single page height in px (matching 1123px A4 height)
    const pageHeight = 1123;
    const computedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
    setPages(computedPages);
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-6">
      {Array.from({ length: pages }, (_, pageIndex) => (
        <div key={pageIndex} className="w-full flex flex-col items-center">
          {pages > 1 ? (
            <div className="mb-2 flex w-full max-w-[794px] items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Page {pageIndex + 1} of {pages}</span>
              <span>A4</span>
            </div>
          ) : null}

          <div
            className="relative w-full max-w-[794px] overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-900/5"
            style={{
              // A4 aspect ratio: 210mm / 297mm -> height = width * 1.4142
              aspectRatio: "210 / 297",
              minHeight: "560px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(-${pageIndex * 100}%)`,
                paddingTop: "53px",    // 40pt equivalent in px
                paddingBottom: "53px", // 40pt equivalent in px
                paddingLeft: "64px",   // 48pt equivalent in px
                paddingRight: "64px",  // 48pt equivalent in px
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "14px",      // 10.5pt equivalent
                lineHeight: "1.35",
                color: "#374151",
              }}
              ref={pageIndex === 0 ? contentRef : undefined}
            >
              {/* Header */}
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h1
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: "32px", // 24pt
                      color: "#1e3a8a",
                      letterSpacing: "0.5px",
                      lineHeight: "1.1",
                      textTransform: "uppercase",
                    }}
                  >
                    {fullName || "YOUR NAME"}
                  </h1>
                  {jobTitle ? (
                    <p
                      style={{
                        marginTop: "5px",
                        fontSize: "16px", // 12pt
                        color: "#374151",
                        fontWeight: 400,
                      }}
                    >
                      {jobTitle}
                    </p>
                  ) : null}
                  {contactLine ? (
                    <p
                      style={{
                        marginTop: "4px",
                        fontSize: "13.3px", // 10pt
                        color: "#4b5563",
                      }}
                    >
                      {contactLine}
                    </p>
                  ) : null}
                </div>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt=""
                    style={{
                      width: "96px",  // 72pt
                      height: "96px", // 72pt
                      borderRadius: "5px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : null}
              </header>

              {/* Professional Summary */}
              {objective ? (
                <Section heading="Professional Summary">
                  <p style={{ fontSize: "14px", lineHeight: "1.45", color: "#374151" }}>
                    {objective}
                  </p>
                </Section>
              ) : null}

              {/* Education */}
              {education.some((e) => e.degree || e.school) ? (
                <Section heading="Education">
                  <div>
                    {education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: "11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, color: "#374151" }}>{edu.degree}</span>
                          <span style={{ fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>
                            {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontStyle: "italic", color: "#4b5563" }}>
                          <span>{edu.school}</span>
                          <span style={{ whiteSpace: "nowrap" }}>{edu.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {/* Experience */}
              {experience.some((e) => e.title) ? (
                <Section heading="Experience">
                  <div>
                    {experience.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: "11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, color: "#374151" }}>{exp.title}</span>
                          <span style={{ fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{exp.date}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontStyle: "italic", color: "#4b5563" }}>
                          <span>{exp.role}</span>
                          {exp.link ? (
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#4b5563", textDecoration: "underline", whiteSpace: "nowrap" }}
                            >
                              {exp.link}
                            </a>
                          ) : null}
                        </div>
                        {exp.bullets?.filter(Boolean).length ? (
                          <div style={{ marginTop: "4px" }}>
                            {exp.bullets.filter(Boolean).map((bullet, i) => (
                              <Bullet key={i}>{bullet}</Bullet>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {/* Projects */}
              {projects.some((p) => p.title) ? (
                <Section heading="Projects">
                  <div>
                    {projects.map((proj) => (
                      <div key={proj.id} style={{ marginBottom: "11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontWeight: 700, color: "#374151" }}>{proj.title}</span>
                          <span style={{ fontWeight: 700, color: "#374151", whiteSpace: "nowrap" }}>{proj.date}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontStyle: "italic", color: "#4b5563" }}>
                          <span>{proj.role}</span>
                          {proj.link ? (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#4b5563", textDecoration: "underline", whiteSpace: "nowrap" }}
                            >
                              {proj.link}
                            </a>
                          ) : null}
                        </div>
                        {proj.bullets?.filter(Boolean).length ? (
                          <div style={{ marginTop: "4px" }}>
                            {proj.bullets.filter(Boolean).map((bullet, i) => (
                              <Bullet key={i}>{bullet}</Bullet>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {/* Skills */}
              {skills ? (
                <Section heading="Skills">
                  <Bullet>{skills}</Bullet>
                </Section>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({ heading, children }) {
  return (
    <section style={{ marginTop: "19px" }}>
      <h2
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "14.7px", // 11pt
          color: "#1e3a8a",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          paddingBottom: "4px",
          borderBottom: "2px solid #1e3a8a",
        }}
      >
        {heading}
      </h2>
      <div style={{ marginTop: "8px" }}>{children}</div>
    </section>
  );
}

function Bullet({ children }) {
  return (
    <div style={{ display: "flex", marginTop: "4px", paddingRight: "3px" }}>
      <span style={{ width: "13px", fontSize: "14px", flexShrink: 0, color: "#374151" }}>•</span>
      <span style={{ flex: 1, fontSize: "14px", lineHeight: "1.35", color: "#374151" }}>
        {children}
      </span>
    </div>
  );
}

