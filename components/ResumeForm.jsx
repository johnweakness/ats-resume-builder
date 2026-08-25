"use client";

import { useState } from "react";
import { emptyCredential, emptyEducation, emptyExperience, emptyProject } from "@/lib/defaultResume";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

export default function ResumeForm({ data, onChange, showAdditionalSections = false, resumeType = "" }) {
  const [photoError, setPhotoError] = useState("");
  const noExperience = resumeType === "no-experience";

  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file (PNG or JPG).");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Image is too large (max 2MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => set("photo", reader.result);
    reader.readAsDataURL(file);
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

  function updateEntry(section, id, field, value) {
    onChange({
      ...data,
      [section]: data[section].map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  }

  function addEntry(section, factory) {
    onChange({ ...data, [section]: [...data[section], factory()] });
  }

  function removeEntry(section, id) {
    onChange({ ...data, [section]: data[section].filter((e) => e.id !== id) });
  }

  function updateEntryBullet(section, entryId, index, value) {
    onChange({
      ...data,
      [section]: data[section].map((e) =>
        e.id === entryId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) }
          : e
      ),
    });
  }

  function addEntryBullet(section, entryId) {
    onChange({
      ...data,
      [section]: data[section].map((e) =>
        e.id === entryId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    });
  }

  function removeEntryBullet(section, entryId, index) {
    onChange({
      ...data,
      [section]: data[section].map((e) =>
        e.id === entryId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      ),
    });
  }

  return (
    <div className="space-y-8">
      <Card title="Basic Information">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
            {data.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">🙂</span>
            )}
          </div>
          <div>
            <label className={labelClass}>Photo (optional)</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-700">
                Upload photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              {data.photo ? (
                <RemoveButton onClick={() => set("photo", null)} />
              ) : null}
            </div>
            {photoError ? <p className="mt-1 text-xs text-red-600">{photoError}</p> : null}
          </div>
        </div>
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
          <Field label="LinkedIn (optional)">
            <input
              className={inputClass}
              value={data.linkedin || ""}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="linkedin.com/in/yourname"
            />
          </Field>
          <Field label="Portfolio / Website (optional)">
            <input
              className={inputClass}
              value={data.portfolio || ""}
              onChange={(e) => set("portfolio", e.target.value)}
              placeholder="yourportfolio.com"
            />
          </Field>
        </div>
      </Card>

      <Card title={noExperience ? "Objective" : "Professional Summary"}>
        <Field label={noExperience ? "1-2 lines about your degree or track and skills that match the role" : "2-4 lines tailored to the role, including experience, key skills, and a measurable result"}>
          <textarea
            className={`${inputClass} min-h-[100px]`}
            value={data.objective}
            onChange={(e) => set("objective", e.target.value)}
              placeholder={noExperience ? "e.g. Recent IT graduate with hands-on web development skills, seeking an entry-level developer role." : "e.g. Web developer with 3+ years of experience building responsive applications that improved user engagement by 25%."}
          />
        </Field>
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
                    placeholder="Bachelor of Science in Information Technology"
                  />
                </Field>
                <Field label="School">
                  <input
                    className={inputClass}
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    placeholder="Your University"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputClass}
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                    placeholder="City, Province"
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

      <Card title={noExperience ? "Internship" : "Experience"}>
        <div className="space-y-5">
          {data.experience.length === 0 ? (
            <p className="text-xs text-slate-400">
              No work experience added yet. If you don't have any, that's okay — add your
              projects below instead.
            </p>
          ) : null}
          {data.experience.map((exp, idx) => (
            <div key={exp.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Entry {idx + 1}
                </span>
                {noExperience ? <RemoveButton onClick={() => removeEntry("experience", exp.id)} /> : null}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Company">
                  <input
                    className={inputClass}
                    value={exp.title}
                    onChange={(e) => updateEntry("experience", exp.id, "title", e.target.value)}
                    placeholder="Company Name"
                  />
                </Field>
                <Field label="Job Title / Role">
                  <input
                    className={inputClass}
                    value={exp.role}
                    onChange={(e) => updateEntry("experience", exp.id, "role", e.target.value)}
                    placeholder="Your Job Title"
                  />
                </Field>
                <Field label="Link (optional)">
                  <input
                    className={inputClass}
                    value={exp.link}
                    onChange={(e) => updateEntry("experience", exp.id, "link", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Date">
                  <input
                    className={inputClass}
                    value={exp.date}
                    onChange={(e) => updateEntry("experience", exp.id, "date", e.target.value)}
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
                        onChange={(e) => updateEntryBullet("experience", exp.id, i, e.target.value)}
                        placeholder="Describe a responsibility and its measurable result."
                      />
                      {exp.bullets.length > 1 ? (
                        <RemoveButton onClick={() => removeEntryBullet("experience", exp.id, i)} />
                      ) : null}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addEntryBullet("experience", exp.id)}
                  className="mt-2 text-xs font-medium text-blue-700 hover:underline"
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
          <AddButton onClick={() => addEntry("experience", emptyExperience)} label={noExperience ? "Add internship" : "Add work experience"} />
        </div>
      </Card>

      <Card title="Projects">
        <div className="space-y-5">
          {data.projects.length === 0 ? (
            <p className="text-xs text-slate-400">
              No projects added yet. Great for school, personal, or portfolio projects.
            </p>
          ) : null}
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Entry {idx + 1}
                </span>
                <RemoveButton onClick={() => removeEntry("projects", proj.id)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Project Title">
                  <input
                    className={inputClass}
                    value={proj.title}
                    onChange={(e) => updateEntry("projects", proj.id, "title", e.target.value)}
                    placeholder="Project Name"
                  />
                </Field>
                <Field label="Your Role">
                  <input
                    className={inputClass}
                    value={proj.role}
                    onChange={(e) => updateEntry("projects", proj.id, "role", e.target.value)}
                    placeholder="e.g. Team Lead, Developer"
                  />
                </Field>
                <Field label="Link (optional)">
                  <input
                    className={inputClass}
                    value={proj.link}
                    onChange={(e) => updateEntry("projects", proj.id, "link", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Date">
                  <input
                    className={inputClass}
                    value={proj.date}
                    onChange={(e) => updateEntry("projects", proj.id, "date", e.target.value)}
                    placeholder="August 2026"
                  />
                </Field>
              </div>
              <div className="mt-3">
                <span className={labelClass}>Bullet points</span>
                <div className="space-y-2">
                  {proj.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <textarea
                        className={`${inputClass} min-h-[44px]`}
                        value={bullet}
                        onChange={(e) => updateEntryBullet("projects", proj.id, i, e.target.value)}
                        placeholder="Describe what the project does and the problem it solves."
                      />
                      {proj.bullets.length > 1 ? (
                        <RemoveButton onClick={() => removeEntryBullet("projects", proj.id, i)} />
                      ) : null}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addEntryBullet("projects", proj.id)}
                  className="mt-2 text-xs font-medium text-blue-700 hover:underline"
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
          <AddButton onClick={() => addEntry("projects", emptyProject)} label="Add project" />
        </div>
      </Card>

      {showAdditionalSections ? (
        <>
          <CredentialSection
            title="Certifications"
            entries={data.certifications || []}
            section="certifications"
            addLabel="Add certification"
            onAdd={() => addEntry("certifications", emptyCredential)}
            onRemove={removeEntry}
            onUpdate={updateEntry}
          />
        </>
      ) : null}

    </div>
  );
}

function CredentialSection({ title, entries, section, addLabel, onAdd, onRemove, onUpdate }) {
  return (
    <Card title={title}>
      <div className="space-y-5">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400">Entry {idx + 1}</span>
              <RemoveButton onClick={() => onRemove(section, entry.id)} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input className={inputClass} value={entry.title} onChange={(e) => onUpdate(section, entry.id, "title", e.target.value)} />
              </Field>
              <Field label="Issuing Organization / Host">
                <input className={inputClass} value={entry.organization} onChange={(e) => onUpdate(section, entry.id, "organization", e.target.value)} />
              </Field>
              <Field label="Date">
                <input className={inputClass} value={entry.date} onChange={(e) => onUpdate(section, entry.id, "date", e.target.value)} placeholder="August 2026" />
              </Field>
            </div>
          </div>
        ))}
        <AddButton onClick={onAdd} label={addLabel} />
      </div>
    </Card>
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
