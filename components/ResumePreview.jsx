"use client";

// Clean single-page/fluid document preview with A4 proportional styling matching PDF export
export default function ResumePreview({ data }) {
  const {
    fullName,
    resumeType,
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

  return (
    <div className="w-full max-w-[794px] mx-auto rounded-sm bg-white p-8 sm:p-12 shadow-md ring-1 ring-slate-900/5 text-slate-800">
      {/* Header */}
      <header className={`relative text-center ${photo ? "pr-24 sm:pr-28" : ""}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-blue-900 uppercase">
            {fullName || "YOUR NAME"}
          </h1>
          {jobTitle ? (
            <p className="mt-1 text-sm sm:text-base font-normal text-slate-700">{jobTitle}</p>
          ) : null}
          {contactLine ? (
            <p className="mt-5 border-y border-slate-600 py-3 text-xs sm:text-sm text-slate-600">{contactLine}</p>
          ) : null}
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            className="absolute right-0 top-0 h-20 w-20 sm:h-24 sm:w-24 rounded object-cover"
          />
        ) : null}
      </header>

      {/* Objective / Professional Summary */}
      {objective ? (
        <Section heading={resumeType === "no-experience" ? "Objective" : "Professional Summary"}>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{objective}</p>
        </Section>
      ) : null}

      {/* Education */}
      {education.some((e) => e.degree || e.school) ? (
        <Section heading="Education">
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-2 font-bold text-xs sm:text-sm text-slate-800">
                  <span>{edu.degree}</span>
                  <span className="whitespace-nowrap font-bold">
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 italic text-xs sm:text-sm text-slate-600">
                  <span>{edu.school}</span>
                  <span className="whitespace-nowrap not-italic sm:italic">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Internship / Experience */}
      {experience.some((e) => e.title) ? (
        <Section heading={resumeType === "no-experience" ? "Internship" : "Experience"}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-2 font-bold text-xs sm:text-sm text-slate-800">
                  <span>{exp.title}</span>
                  <span className="whitespace-nowrap font-bold">{exp.date}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2 italic text-xs sm:text-sm text-slate-600">
                  <span>{exp.role}</span>
                  {exp.link ? (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noreferrer"
                      className="whitespace-nowrap text-blue-700 hover:underline not-italic"
                    >
                      {exp.link}
                    </a>
                  ) : null}
                </div>
                {exp.bullets?.filter(Boolean).length ? (
                  <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs sm:text-sm text-slate-700 leading-normal">
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
        <Section heading="Skills">
          <ul className="pl-4 list-disc text-xs sm:text-sm text-slate-700 leading-normal">
            <li>{skills}</li>
          </ul>
        </Section>
      ) : null}

      <CredentialPreview heading="Certifications" entries={certifications} />

      {/* Projects */}
      {projects.some((p) => p.title) ? (
        <Section heading="Projects">
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between gap-2 font-bold text-xs sm:text-sm text-slate-800">
                  <span>{proj.title}</span>
                  <span className="whitespace-nowrap font-bold">{proj.date}</span>
                </div>
                <div className="flex items-baseline justify-between gap-2 italic text-xs sm:text-sm text-slate-600">
                  <span>{proj.role}</span>
                  {proj.link ? (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="whitespace-nowrap text-blue-700 hover:underline not-italic"
                    >
                      {proj.link}
                    </a>
                  ) : null}
                </div>
                {proj.bullets?.filter(Boolean).length ? (
                  <ul className="mt-1.5 space-y-1 pl-4 list-disc text-xs sm:text-sm text-slate-700 leading-normal">
                    {proj.bullets.filter(Boolean).map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

    </div>
  );
}

function CredentialPreview({ heading, entries }) {
  const completeEntries = entries.filter((entry) => entry.title);
  if (!completeEntries.length) return null;

  return (
    <Section heading={heading}>
      <ul className="space-y-1 pl-4 list-disc text-xs sm:text-sm text-slate-700 leading-normal">
        {completeEntries.map((entry) => (
          <li key={entry.id}>
            <span className="font-semibold">{entry.title}</span>
            {[entry.organization, entry.date].filter(Boolean).length ? ` — ${[entry.organization, entry.date].filter(Boolean).join(", ")}` : ""}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Section({ heading, children }) {
  return (
    <section className="mt-4 sm:mt-5">
      <h2 className="border-b-2 border-blue-900 pb-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-900">
        {heading}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

