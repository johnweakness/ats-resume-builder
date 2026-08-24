"use client";

// On-screen preview only. Tailwind classes approximate the exact PDF layout
// produced by lib/resumePdf.js (the source of truth for the exported file).
export default function ResumePreview({ data }) {
  const {
    fullName,
    jobTitle,
    location,
    phone,
    email,
    photo,
    objective,
    education = [],
    experienceHeading = "PROJECTS",
    experience = [],
    skills,
  } = data;

  const contactLine = [location, phone, email].filter(Boolean).join(" | ");

  return (
    <div
      id="resume-preview"
      className="mx-auto w-full max-w-[816px] bg-white px-12 py-10 text-[13px] leading-snug text-slate-800 shadow-sm"
    >
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide text-blue-800">
            {fullName || "Your Name"}
          </h1>
          {jobTitle ? <p className="mt-1 text-base text-slate-700">{jobTitle}</p> : null}
          {contactLine ? <p className="mt-1 text-slate-600">{contactLine}</p> : null}
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            className="h-24 w-24 shrink-0 rounded object-cover"
          />
        ) : null}
      </header>

      {objective ? (
        <Section heading="OBJECTIVE">
          <p className="text-slate-700">{objective}</p>
        </Section>
      ) : null}

      {education.some((e) => e.degree || e.school) ? (
        <Section heading="EDUCATION">
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between font-semibold">
                  <span>{edu.degree}</span>
                  <span className="whitespace-nowrap text-sm">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between italic text-slate-600">
                  <span>{edu.school}</span>
                  <span className="whitespace-nowrap text-sm">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {experience.some((e) => e.title) ? (
        <Section heading={experienceHeading || "EXPERIENCE"}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between font-semibold">
                  <span>{exp.title}</span>
                  <span className="whitespace-nowrap text-sm">{exp.date}</span>
                </div>
                <div className="flex items-baseline justify-between italic text-slate-600">
                  <span>{exp.role}</span>
                  <span className="whitespace-nowrap text-sm text-slate-500">{exp.link}</span>
                </div>
                {exp.bullets?.filter(Boolean).length ? (
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {exp.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {skills ? (
        <Section heading="SKILLS">
          <ul className="list-disc space-y-1 pl-5">
            <li>{skills}</li>
          </ul>
        </Section>
      ) : null}
    </div>
  );
}

function Section({ heading, children }) {
  return (
    <section className="mt-5">
      <h2 className="border-b-2 border-blue-800 pb-1 text-sm font-bold tracking-wide text-blue-800">
        {heading}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
