"use client";

import { Fragment, useMemo } from "react";

// A4-style preview that keeps each page at a fixed size and stacks overflow on page 2+
export default function ResumePreview({ data }) {
  const pages = useMemo(() => buildPages(data), [data]);

  return (
    <div className="mx-auto flex w-full max-w-[794px] flex-col gap-6">
      {pages.map((page, index) => (
        <ResumePage
          key={index}
          page={page}
          pageNumber={index + 1}
          totalPages={pages.length}
        />
      ))}
    </div>
  );
}

function ResumePage({ page, pageNumber, totalPages }) {
  const { fullName, jobTitle, contactLine, photo, photoNameAlign, headerPaddingRight } = page.meta;

  return (
    <section className="relative w-full overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-900/5">
      <div className="aspect-[210/297] w-full">
        <div className="flex h-full flex-col p-8 text-slate-800 sm:p-12">
          <header className={`relative ${headerPaddingRight} ${photo ? "text-left" : "text-center"}`}>
            <div>
              <h1
                className={`text-2xl font-bold tracking-wide text-blue-900 uppercase sm:text-3xl ${photoNameAlign}`}
              >
                {fullName || "YOUR NAME"}
              </h1>
              {jobTitle ? (
                <p className={`mt-1 text-sm font-normal text-slate-700 sm:text-base ${photoNameAlign}`}>
                  {jobTitle}
                </p>
              ) : null}
              {contactLine ? (
                <p
                  className={
                    photo
                      ? "mt-1 border-b border-blue-700 pb-3 text-xs text-slate-700 sm:text-sm"
                      : "mt-5 border-y border-slate-600 py-3 text-xs text-slate-600 sm:text-sm"
                  }
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
                className="absolute right-0 top-0 h-24 w-24 object-cover sm:h-28 sm:w-28"
              />
            ) : null}
          </header>

          <div className="mt-4 min-h-0 flex-1 overflow-hidden">
            <div className="space-y-4 sm:space-y-5">
              {page.sections.map((section) => (
                <Fragment key={section.key}>{renderSection(section)}</Fragment>
              ))}
            </div>
          </div>

          <div className="mt-3 text-right text-[10px] text-slate-400">
            Page {pageNumber} of {totalPages}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderSection(section) {
  if (section.type === "objective") {
    return (
      <Section heading={section.heading}>
        <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">{section.value}</p>
      </Section>
    );
  }

  if (section.type === "education") {
    return (
      <Section heading="Education">
        <div className="space-y-3">
          {section.entries.map((edu) => (
            <div key={edu.id}>
              <div className="flex items-baseline justify-between gap-2 text-xs font-bold text-slate-800 sm:text-sm">
                <span>{edu.degree}</span>
                <span className="whitespace-nowrap font-bold">{[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 text-xs italic text-slate-600 sm:text-sm">
                <span>{edu.school}</span>
                <span className="whitespace-nowrap not-italic sm:italic">{edu.location}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (section.type === "experience") {
    return (
      <Section heading={section.heading}>
        <div className="space-y-4">
          {section.entries.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-baseline justify-between gap-2 text-xs font-bold text-slate-800 sm:text-sm">
                <span>{exp.title}</span>
                <span className="whitespace-nowrap font-bold">{exp.date}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 text-xs italic text-slate-600 sm:text-sm">
                <span>{exp.role}</span>
                {exp.link ? (
                  <a href={exp.link} target="_blank" rel="noreferrer" className="whitespace-nowrap not-italic text-blue-700 hover:underline">
                    {exp.link}
                  </a>
                ) : null}
              </div>
              {exp.bullets?.filter(Boolean).length ? (
                <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs leading-normal text-slate-700 sm:text-sm">
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (section.type === "skills") {
    return (
      <Section heading="Skills">
        <ul className="list-disc pl-4 text-xs leading-normal text-slate-700 sm:text-sm">
          <li>{section.value}</li>
        </ul>
      </Section>
    );
  }

  if (section.type === "certifications") {
    return <CredentialPreview heading="Certifications" entries={section.entries} />;
  }

  if (section.type === "projects") {
    return (
      <Section heading="Projects">
        <div className="space-y-4">
          {section.entries.map((proj) => (
            <div key={proj.id}>
              <div className="flex items-baseline justify-between gap-2 text-xs font-bold text-slate-800 sm:text-sm">
                <span>{proj.title}</span>
                <span className="whitespace-nowrap font-bold">{proj.date}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 text-xs italic text-slate-600 sm:text-sm">
                <span>{proj.role}</span>
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="whitespace-nowrap not-italic text-blue-700 hover:underline">
                    {proj.link}
                  </a>
                ) : null}
              </div>
              {proj.bullets?.filter(Boolean).length ? (
                <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs leading-normal text-slate-700 sm:text-sm">
                  {proj.bullets.filter(Boolean).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return null;
}

function CredentialPreview({ heading, entries }) {
  const completeEntries = entries.filter((entry) => entry.title);
  if (!completeEntries.length) return null;

  return (
    <Section heading={heading}>
      <ul className="list-disc space-y-1 pl-4 text-xs leading-normal text-slate-700 sm:text-sm">
        {completeEntries.map((entry) => (
          <li key={entry.id}>
            <span className="font-semibold">{entry.title}</span>
            {[entry.organization, entry.date].filter(Boolean).length ? ` - ${[entry.organization, entry.date].filter(Boolean).join(", ")}` : ""}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Section({ heading, children }) {
  return (
    <section>
      <h2 className="border-b-2 border-blue-900 pb-1 text-xs font-bold uppercase tracking-wider text-blue-900 sm:text-sm">
        {heading}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function buildPages(data) {
  const {
    resumeType,
    fullName,
    jobTitle,
    location,
    phone,
    email,
    linkedin,
    portfolio,
    photo,
    objective,
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    skills,
  } = data;

  const contactLine = [location, phone, email, linkedin, portfolio].filter(Boolean).join("   |   ");
  const sections = [];

  if (objective?.trim()) {
    sections.push({
      type: "objective",
      key: "objective",
      heading: resumeType === "no-experience" ? "Objective" : "Professional Summary",
      value: objective,
    });
  }

  if (education.some((e) => e.degree || e.school)) {
    sections.push({ type: "education", key: "education", entries: education.filter((e) => e.degree || e.school) });
  }

  if (experience.some((e) => e.title)) {
    sections.push({
      type: "experience",
      key: "experience",
      heading: resumeType === "no-experience" ? "Internship" : "Experience",
      entries: experience.filter((e) => e.title),
    });
  }

  if (skills?.trim()) {
    sections.push({ type: "skills", key: "skills", value: skills });
  }

  if (certifications.some((c) => c.title)) {
    sections.push({ type: "certifications", key: "certifications", entries: certifications.filter((c) => c.title) });
  }

  if (projects.some((p) => p.title)) {
    sections.push({ type: "projects", key: "projects", entries: projects.filter((p) => p.title) });
  }

  const pages = [];
  const pageMeta = {
    fullName,
    jobTitle,
    contactLine,
    photo,
    photoNameAlign: photo ? "" : "",
    headerPaddingRight: photo ? "pr-24 sm:pr-28" : "",
  };
  const maxHeight = 820;
  const pageBodyLimit = maxHeight - estimateHeaderHeight({ fullName, jobTitle, contactLine, photo });

  let currentPage = [];
  let currentHeight = 0;

  const flushPage = () => {
    pages.push({
      meta: pageMeta,
      sections: currentPage.length ? currentPage : [{ type: "empty", key: `empty-${pages.length}` }],
    });
    currentPage = [];
    currentHeight = 0;
  };

  const addSection = (section) => {
    const height = estimateSectionHeight(section);
    if (currentHeight + height > pageBodyLimit && currentPage.length) {
      flushPage();
    }
    currentPage.push(section);
    currentHeight += height;
  };

  for (const section of sections) {
    if (section.type === "experience" || section.type === "projects") {
      const split = splitEntriesAcrossPages(section, pageBodyLimit, currentHeight);
      for (const part of split) {
        const height = estimateSectionHeight(part);
        if (currentHeight + height > pageBodyLimit && currentPage.length) {
          flushPage();
        }
        currentPage.push(part);
        currentHeight += height;
        if (currentHeight >= pageBodyLimit) {
          flushPage();
        }
      }
      continue;
    }

    addSection(section);
  }

  if (currentPage.length || !pages.length) flushPage();

  return pages;
}

function estimateHeaderHeight({ fullName, jobTitle, contactLine, photo }) {
  let height = photo ? 180 : 155;
  if (fullName) height += 30;
  if (jobTitle) height += 20;
  if (contactLine) height += 32;
  return height;
}

function estimateSectionHeight(section) {
  switch (section.type) {
    case "objective":
      return 110;
    case "education":
      return 70 + section.entries.length * 42;
    case "experience":
      return 78 + section.entries.reduce((sum, entry) => sum + 54 + (entry.bullets?.filter(Boolean).length || 0) * 22, 0);
    case "skills":
      return 80;
    case "certifications":
      return 70 + section.entries.length * 26;
    case "projects":
      return 78 + section.entries.reduce((sum, entry) => sum + 54 + (entry.bullets?.filter(Boolean).length || 0) * 22, 0);
    default:
      return 0;
  }
}

function splitEntriesAcrossPages(section, pageBodyLimit, currentHeight) {
  const chunks = [];
  let chunkEntries = [];
  let chunkHeight = estimateSectionBaseHeight(section);
  let available = pageBodyLimit - currentHeight;

  for (const entry of section.entries) {
    const entryHeight = estimateEntryHeight(entry);
    if (chunkEntries.length && chunkHeight + entryHeight > available) {
      chunks.push({ ...section, entries: chunkEntries });
      chunkEntries = [];
      chunkHeight = estimateSectionBaseHeight(section);
      available = pageBodyLimit;
    }

    chunkEntries.push(entry);
    chunkHeight += entryHeight;
  }

  if (chunkEntries.length) chunks.push({ ...section, entries: chunkEntries });

  return chunks.length ? chunks : [{ ...section, entries: [] }];
}

function estimateEntryHeight(entry) {
  return 54 + (entry.bullets?.filter(Boolean).length || 0) * 22;
}

function estimateSectionBaseHeight(section) {
  switch (section.type) {
    case "experience":
    case "projects":
      return 36;
    default:
      return estimateSectionHeight(section);
  }
}
