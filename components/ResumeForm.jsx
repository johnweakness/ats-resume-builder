"use client";

import { emptyEducation, emptyExperience } from "@/lib/defaultResume";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export default function ResumeForm({ data, onChange }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  function updateEducation(id, field, value) {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  }

  function addEducation() {
    onChange({ ...data, education: [...data.education, emptyEducation()] });
  }

  function removeEducation(id) {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  }

  function updateExperience(id, field, value) {
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  }

  function addExperience() {
    onChange({ ...data, experience: [...data.experience, emptyExperience()] });
  }

  function removeExperience(id) {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  }

  function updateBullet(expId, index, value) {
    onChange({
      ...data,
      experience: data.experience.map((e) =>
        e.id === expId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) }
          : e
      ),
    });
  }

  function addBullet(expId) {
    onChange({
      ...data,
      experience: data.experience.map((e) =>
        e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    });
  }

  function removeBullet(expId, index) {
    onChange({
      ...data,
      experience: data.experience.map((e) =>
        e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      ),
    });
  }

  return (
    <div className="space-y-8">
      <Card title="Basic Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              className={inputClass}
              value={data.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Juan Dela Cruz"
            />
          </Field>
          <Field label="Job Title">
            <input
              className={inputClass}
              value={data.jobTitle}
              onChange={(e) => set("jobTitle", e.target.value)}
              placeholder="Full-Stack Developer"
            />
          </Field>
          <Field label="Location">
            <input
              className={inputClass}
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Manila, Philippines"
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+63 900 000 0000"
            />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <input
              className={inputClass}
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
        </div>
      </Card>

      <Card title="Objective">
        <Field label="A short summary of your career goal">
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={data.objective}
            onChange={(e) => set("objective", e.target.value)}
            placeholder="To pursue a role where I can apply my skills in..."
          />
        </Field>
      </Card>

      <Card title="Education">
        <div className="space-y-5">
          {data.education.map((edu, idx) => (
            <div key={edu.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Entry {idx + 1}
                </span>
                {data.education.length > 1 ? (
                  <RemoveButton onClick={() => removeEducation(edu.id)} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Degree / Program">
                  <input
                    className={inputClass}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  />
                </Field>
                <Field label="School">
                  <input
                    className={inputClass}
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputClass}
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Start Date">
                    <input
                      className={inputClass}
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      placeholder="August 2022"
                    />
                  </Field>
                  <Field label="End Date">
                    <input
                      className={inputClass}
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      placeholder="June 2026"
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          <AddButton onClick={addEducation} label="Add education" />
        </div>
      </Card>

      <Card title="Experience / Projects">
        <Field label="Section title" className="mb-4 max-w-xs">
          <input
            className={inputClass}
            value={data.experienceHeading}
            onChange={(e) => set("experienceHeading", e.target.value)}
            placeholder="PROJECTS"
          />
        </Field>
        <div className="space-y-5">
          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Entry {idx + 1}
                </span>
                {data.experience.length > 1 ? (
                  <RemoveButton onClick={() => removeExperience(exp.id)} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                  />
                </Field>
                <Field label="Role">
                  <input
                    className={inputClass}
                    value={exp.role}
                    onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                  />
                </Field>
                <Field label="Link (optional)">
                  <input
                    className={inputClass}
                    value={exp.link}
                    onChange={(e) => updateExperience(exp.id, "link", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Date">
                  <input
                    className={inputClass}
                    value={exp.date}
                    onChange={(e) => updateExperience(exp.id, "date", e.target.value)}
                    placeholder="August 2026"
                  />
                </Field>
              </div>
              <div className="mt-3">
                <span className={labelClass}>Bullet points</span>
                <div className="space-y-2">
                  {exp.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <textarea
                        className={`${inputClass} min-h-[44px]`}
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                      />
                      {exp.bullets.length > 1 ? (
                        <RemoveButton onClick={() => removeBullet(exp.id, i)} />
                      ) : null}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="mt-2 text-xs font-medium text-blue-700 hover:underline"
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
          <AddButton onClick={addExperience} label="Add entry" />
        </div>
      </Card>

      <Card title="Skills">
        <Field label="Separate skills with a semicolon ( ; )">
          <textarea
            className={`${inputClass} min-h-[80px]`}
            value={data.skills}
            onChange={(e) => set("skills", e.target.value)}
            placeholder="React; Next.js; JavaScript; Tailwind CSS"
          />
        </Field>
      </Card>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition hover:border-blue-400 hover:text-blue-700"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Remove
    </button>
  );
}
