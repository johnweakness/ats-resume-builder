let idCounter = 0;
export function newId(prefix = "item") {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function emptyEducation() {
  return { id: newId("edu"), degree: "", school: "", location: "", startDate: "", endDate: "" };
}

export function emptyExperience() {
  return {
    id: newId("exp"),
    title: "",
    role: "",
    link: "",
    date: "",
    bullets: [""],
  };
}

export function emptyProject() {
  return {
    id: newId("proj"),
    title: "",
    role: "",
    link: "",
    date: "",
    bullets: [""],
  };
}

export function emptyCredential() {
  return { id: newId("credential"), title: "", organization: "", date: "" };
}

export function emptyResume() {
  return {
    fullName: "",
    jobTitle: "",
    location: "",
    phone: "",
    email: "",
    photo: null,
    objective: "",
    education: [emptyEducation()],
    experience: [],
    projects: [],
    certifications: [],
    seminarsTrainings: [],
    awardsAchievements: [],
    skills: "",
  };
}

function normalizeEntries(list, idPrefix) {
  return Array.isArray(list) && list.length
    ? list.map((entry) => ({
        id: newId(idPrefix),
        title: entry.title || "",
        role: entry.role || "",
        link: entry.link || "",
        date: entry.date || "",
        bullets: Array.isArray(entry.bullets) && entry.bullets.length ? entry.bullets : [""],
      }))
    : [];
}

function normalizeCredentials(list, idPrefix) {
  return Array.isArray(list) && list.length
    ? list.map((entry) => ({
        id: newId(idPrefix),
        title: entry.title || "",
        organization: entry.organization || "",
        date: entry.date || "",
      }))
    : [];
}

// Fills in missing fields and assigns stable ids to array entries coming
// from an external source (e.g. the Gemini optimize API) so the form/preview
// components can rely on a consistent shape.
export function normalizeResume(raw = {}) {
  const education =
    Array.isArray(raw.education) && raw.education.length
      ? raw.education.map((edu) => ({
          id: newId("edu"),
          degree: edu.degree || "",
          school: edu.school || "",
          location: edu.location || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
        }))
      : [emptyEducation()];

  return {
    fullName: raw.fullName || "",
    jobTitle: raw.jobTitle || "",
    location: raw.location || "",
    phone: raw.phone || "",
    email: raw.email || "",
    photo: raw.photo || null,
    objective: raw.objective || "",
    education,
    experience: normalizeEntries(raw.experience, "exp"),
    projects: normalizeEntries(raw.projects, "proj"),
    certifications: normalizeCredentials(raw.certifications, "cert"),
    seminarsTrainings: normalizeCredentials(raw.seminarsTrainings, "training"),
    awardsAchievements: normalizeCredentials(raw.awardsAchievements, "award"),
    skills: raw.skills || "",
  };
}

// Returns a list of human-readable field names that are still empty, so the
// UI can block PDF downloads until the resume is actually complete.
export function getMissingResumeFields(data = {}) {
  const missing = [];

  if (!data.fullName?.trim()) missing.push("Full Name");
  if (!data.jobTitle?.trim()) missing.push("Job Title");
  if (!data.location?.trim()) missing.push("Location");
  if (!data.phone?.trim()) missing.push("Phone Number");
  if (!data.email?.trim()) missing.push("Email");
  if (!data.objective?.trim()) missing.push("Professional Summary");
  if (!data.skills?.trim()) missing.push("Skills");

  const hasEducation =
    Array.isArray(data.education) &&
    data.education.some((edu) => edu.degree?.trim() && edu.school?.trim());
  if (!hasEducation) missing.push("Education (degree and school)");

  const hasCompleteEntry = (list) =>
    Array.isArray(list) &&
    list.some(
      (entry) =>
        entry.title?.trim() &&
        entry.role?.trim() &&
        Array.isArray(entry.bullets) &&
        entry.bullets.some((bullet) => bullet.trim())
    );

  // Only require a section to be complete if the user actually added entries
  // to it. If both Experience and Projects were removed entirely, neither is
  // required — this stays true no matter which template it started from.
  const hasExperienceEntries = Array.isArray(data.experience) && data.experience.length > 0;
  const hasProjectEntries = Array.isArray(data.projects) && data.projects.length > 0;

  if (hasExperienceEntries && !hasCompleteEntry(data.experience)) {
    missing.push("Experience (title, role, and at least one bullet)");
  }
  if (hasProjectEntries && !hasCompleteEntry(data.projects)) {
    missing.push("Projects (title, role, and at least one bullet)");
  }

  return missing;
}

export const sampleResume = {
  fullName: "Jaykie Melchor Gado",
  jobTitle: "AI-Assisted Full-Stack Developer",
  location: "Romblon, Philippines",
  phone: "+639695236591",
  email: "gadojaykie91@gmail.com",
  objective:
    "AI-assisted full-stack developer skilled in modern web development and AI-assisted coding, experienced in building, improving, and maintaining responsive and user-friendly websites. Adept at creating practical web solutions, troubleshooting existing systems, and collaborating effectively with a team to meet real business and marketing needs.",
  education: [
    {
      id: newId("edu"),
      degree: "Bachelor of Science in Information Technology",
      school: "Romblon State University",
      location: "Liwanag, Odiongan, Romblon",
      startDate: "August 2022",
      endDate: "June 2026",
    },
  ],
  experience: [],
  projects: [
    {
      id: newId("proj"),
      title: "Appointment & Booking SaaS",
      role: "Web Developer",
      link: "https://appointment-booking-saas-inky.vercel.app/",
      date: "August 2026",
      bullets: [
        "Appointment Booking SaaS is a responsive admin dashboard for managing appointments, customers, staff schedules, services, payments, and analytics in one workspace.",
        "Built with React 19, TypeScript, Vite, Express, Prisma ORM, and Neon PostgreSQL, it uses Vercel Functions to host API and Vercel to deploy the frontend.",
        "The platform supports database records, appointment creation, status tracking, search, filters, health checks, confirmation dialogs, notifications, and mobile-friendly layouts.",
        "Its modular architecture is prepared for authentication, employee access, and future payment integrations.",
      ],
    },
    {
      id: newId("exp"),
      title: "AI-Powered CRM & Lead Management SaaS",
      role: "Web Developer",
      link: "https://ai-crm-aa78675f5-jaykie.vercel.app/",
      date: "August 2026",
      bullets: [
        "Production-oriented AI CRM SaaS for marketing agencies, built with Next.js, React, TypeScript, Tailwind CSS, Supabase, and PostgreSQL.",
        "Features include authentication, role-based workspaces, lead management, Kanban pipeline, tasks, analytics, CSV import/export, notifications, Google integrations, responsive pages, and Gemini-powered follow-up message generation.",
      ],
    },
    {
      id: newId("exp"),
      title: "AI Marketing Content SaaS",
      role: "Web Developer",
      link: "https://brandpilot-ai-marketing-saas.vercel.app/",
      date: "August 2026",
      bullets: [
        "BrandPilot is a production-ready AI marketing SaaS built with Next.js, Supabase, Google Gemini, Stripe, and Vercel. Users can create accounts, configure a unique brand voice, generate tailored social posts, advertisements, emails, product descriptions, landing-page copy, and SEO metadata.",
        "It includes secure user-owned data, content history, usage limits, responsive design, subscription billing, protected APIs, and modern notifications.",
      ],
    },
  ],
  skills:
    "Full-Stack Development; Web Development; Web Application Development; React; Next.js; JavaScript; PHP; MySQL; PostgreSQL; Supabase; API Integration; RESTful API; Tailwind CSS; HTML5; Generative AI",
};
