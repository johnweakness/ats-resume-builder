"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

const PAGE_HEIGHT = 1122;
const PAGE_WIDTH = 794;

export default function ResumePreview({ data }) {
  const items = useMemo(() => buildItems(data), [data]);
  const [heights, setHeights] = useState({});
  const measureRefs = useRef({});

  useLayoutEffect(() => {
    const next = {};
    let changed = false;

    for (const item of items) {
      const node = measureRefs.current[item.key];
      const height = node?.getBoundingClientRect().height || 0;
      if (height && heights[item.key] !== height) {
        next[item.key] = height;
        changed = true;
      } else if (heights[item.key]) {
        next[item.key] = heights[item.key];
      }
    }

    if (changed) setHeights(next);
  }, [items, heights]);

  const pages = useMemo(() => paginateItems(items, heights), [items, heights]);

  return (
    <div className="mx-auto flex w-full max-w-[794px] flex-col gap-6">
      <MeasurementLayer items={items} refsMap={measureRefs} />

      {pages.map((page, index) => (
        <ResumePage
          key={index}
          page={page}
          pageNumber={index + 1}
          totalPages={pages.length}
          showHeader={index === 0}
        />
      ))}
    </div>
  );
}

function ResumePage({ page, pageNumber, totalPages, showHeader }) {
  const { fullName, jobTitle, contactLine, photo, photoNameAlign, headerPaddingRight } = page.meta;

  return (
    <section className="relative w-full overflow-hidden rounded-sm bg-white shadow-md ring-1 ring-slate-900/5">
      <div style={{ aspectRatio: "210 / 297", width: "100%" }}>
        <div className={`flex h-full flex-col text-slate-800 ${showHeader ? "p-8 sm:p-12" : "px-8 pb-8 pt-4 sm:px-12 sm:pb-12 sm:pt-6"}`}>
          {showHeader ? (
            <header className={`relative ${headerPaddingRight} ${photo ? "text-left" : "text-center"}`}>
              <div>
                <h1 className={`text-2xl font-bold tracking-wide text-blue-900 uppercase sm:text-3xl ${photoNameAlign}`}>
                  {fullName || "YOUR NAME"}
                </h1>
                {jobTitle ? <p className={`mt-1 text-sm font-normal text-slate-700 sm:text-base ${photoNameAlign}`}>{jobTitle}</p> : null}
                {contactLine ? (
                  <p className={photo ? "mt-1 border-b border-blue-700 pb-3 text-xs text-slate-700 sm:text-sm" : "mt-5 border-y border-slate-600 py-3 text-xs text-slate-600 sm:text-sm"}>
                    {contactLine}
                  </p>
                ) : null}
              </div>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="absolute right-0 top-0 h-24 w-24 object-cover sm:h-28 sm:w-28" />
              ) : null}
            </header>
          ) : null}

          <div className={showHeader ? "mt-4 min-h-0 flex-1 overflow-hidden" : "min-h-0 flex-1 overflow-hidden"}>
            <div className="space-y-4 sm:space-y-5">
              {page.items.map((item) => (
                <PageItem key={item.key} item={item} />
              ))}
            </div>
          </div>

          <div className={showHeader ? "mt-3 text-right text-[10px] text-slate-400" : "mt-2 text-right text-[10px] text-slate-400"}>
            Page {pageNumber} of {totalPages}
          </div>
        </div>
      </div>
    </section>
  );
}

function MeasurementLayer({ items, refsMap }) {
  return (
    <div className="pointer-events-none absolute left-[-10000px] top-0 w-[794px] overflow-hidden" aria-hidden="true">
      <div style={{ width: `${PAGE_WIDTH}px` }}>
        <div className="flex flex-col p-8 text-slate-800 sm:p-12">
          {items.map((item) => (
            <div
              key={item.key}
              ref={(node) => {
                if (node) refsMap.current[item.key] = node;
              }}
              className="w-full"
            >
              <PageItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageItem({ item }) {
  if (item.type === "objective") {
    return (
      <Section heading={item.heading}>
        <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">{item.value}</p>
      </Section>
    );
  }

  if (item.type === "education") {
    return (
      <Section heading="Education">
        <div className="space-y-3">
          {item.entries.map((edu) => (
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

  if (item.type === "experience-start") {
    return <Section heading={item.heading} />;
  }

  if (item.type === "experience-entry") {
    return renderEntry(item.entry);
  }

  if (item.type === "skills") {
    return (
      <Section heading="Skills">
        <ul className="list-disc pl-4 text-xs leading-normal text-slate-700 sm:text-sm">
          <li>{item.value}</li>
        </ul>
      </Section>
    );
  }

  if (item.type === "certifications") {
    const completeEntries = item.entries.filter((entry) => entry.title);
    if (!completeEntries.length) return null;
    return (
      <Section heading="Certifications">
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

  if (item.type === "projects-start") {
    return <Section heading="Projects" />;
  }

  if (item.type === "projects-entry") {
    return renderEntry(item.entry);
  }

  return null;
}

function renderEntry(entry) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-xs font-bold text-slate-800 sm:text-sm">
        <span>{entry.title}</span>
        <span className="whitespace-nowrap font-bold">{entry.date}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2 text-xs italic text-slate-600 sm:text-sm">
        <span>{entry.role}</span>
        {entry.link ? (
          <a href={entry.link} target="_blank" rel="noreferrer" className="whitespace-nowrap not-italic text-blue-700 hover:underline">
            {entry.link}
          </a>
        ) : null}
      </div>
      {entry.bullets?.filter(Boolean).length ? (
        <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs leading-normal text-slate-700 sm:text-sm">
          {entry.bullets.filter(Boolean).map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </div>
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

function buildItems(data) {
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
  const items = [];

  if (objective?.trim()) {
    items.push({
      type: "objective",
      key: "objective",
      heading: resumeType === "no-experience" ? "Objective" : "Professional Summary",
      value: objective,
    });
  }

  if (education.some((e) => e.degree || e.school)) {
    items.push({ type: "education", key: "education", entries: education.filter((e) => e.degree || e.school) });
  }

  if (experience.some((e) => e.title)) {
    items.push({ type: "experience-start", key: "experience-start", heading: resumeType === "no-experience" ? "Internship" : "Experience" });
    experience.filter((e) => e.title).forEach((entry) => {
      items.push({ type: "experience-entry", key: `experience-${entry.id}`, entry });
    });
  }

  if (skills?.trim()) {
    items.push({ type: "skills", key: "skills", value: skills });
  }

  if (certifications.some((c) => c.title)) {
    items.push({ type: "certifications", key: "certifications", entries: certifications.filter((c) => c.title) });
  }

  if (projects.some((p) => p.title)) {
    items.push({ type: "projects-start", key: "projects-start" });
    projects.filter((p) => p.title).forEach((entry) => {
      items.push({ type: "projects-entry", key: `projects-${entry.id}`, entry });
    });
  }

  return items.map((item) => ({ ...item, meta: { fullName, jobTitle, contactLine, photo, photoNameAlign: photo ? "" : "", headerPaddingRight: photo ? "pr-24 sm:pr-28" : "" } }));
}

function paginateItems(items, heights) {
  const pages = [];
  let current = [];
  let currentHeight = 0;
  const limit = PAGE_HEIGHT - headerHeight(items[0]?.meta) - 80;

  for (const item of items) {
    const height = (heights[item.key] || fallbackHeight(item)) + itemGapHeight(item);
    if (current.length && currentHeight + height > limit) {
      pages.push({ meta: items[0].meta, items: current });
      current = [];
      currentHeight = 0;
    }
    current.push(item);
    currentHeight += height;
  }

  if (current.length || !pages.length) {
    pages.push({ meta: items[0]?.meta || emptyMeta(), items: current.length ? current : [{ type: "empty", key: "empty" }] });
  }

  return pages;
}

function headerHeight(meta) {
  if (!meta) return 0;
  let height = meta.photo ? 184 : 158;
  if (meta.fullName) height += 28;
  if (meta.jobTitle) height += 18;
  if (meta.contactLine) height += 34;
  return height;
}

function fallbackHeight(item) {
  switch (item.type) {
    case "objective":
      return 104;
    case "education":
      return 116;
    case "experience-start":
    case "projects-start":
      return 40;
    case "experience-entry":
    case "projects-entry":
      return 116;
    case "skills":
      return 76;
    case "certifications":
      return 68;
    default:
      return 96;
  }
}

function itemGapHeight(item) {
  switch (item.type) {
    case "objective":
    case "education":
    case "experience-start":
    case "experience-entry":
    case "skills":
    case "certifications":
    case "projects-start":
    case "projects-entry":
      return 16;
    default:
      return 12;
  }
}

function emptyMeta() {
  return {
    fullName: "",
    jobTitle: "",
    contactLine: "",
    photo: null,
    photoNameAlign: "",
    headerPaddingRight: "",
  };
}
