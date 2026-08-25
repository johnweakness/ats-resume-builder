import { emptyResume, newId } from "./defaultResume";

// Ready-to-fill ATS templates covering common applicant profiles.
// Each template only pre-configures which sections/entries to start with
// (e.g. a fresh grad starts with a project entry instead of a job entry);
// all text fields start blank so there's no placeholder text to replace.
export const RESUME_TEMPLATES = [
  {
    id: "fresh-grad",
    name: "Fresh Graduate",
    description: "For new graduates with little to no work experience yet.",
    icon: "🎓",
    build: () => ({
      ...emptyResume(),
      education: [
        {
          id: newId("edu"),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      experience: [],
      projects: [
        {
          id: newId("proj"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
      ],
      certifications: [{ id: newId("cert"), title: "", organization: "", date: "" }],
      seminarsTrainings: [{ id: newId("training"), title: "", organization: "", date: "" }],
      awardsAchievements: [{ id: newId("award"), title: "", organization: "", date: "" }],
      skills: "",
    }),
  },
  {
    id: "ojt",
    name: "OJT / Intern",
    description: "For students applying for on-the-job training or internships.",
    icon: "🧑‍💻",
    build: () => ({
      ...emptyResume(),
      education: [
        {
          id: newId("edu"),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      experience: [
        {
          id: newId("exp"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
      ],
      projects: [],
      skills: "",
    }),
  },
  {
    id: "working-student",
    name: "Fresh Grad (Working Student)",
    description: "For new graduates who worked part-time or as a working student.",
    icon: "🧑‍🎓",
    build: () => ({
      ...emptyResume(),
      education: [
        {
          id: newId("edu"),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      experience: [
        {
          id: newId("exp"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
      ],
      projects: [
        {
          id: newId("proj"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
      ],
      skills: "",
    }),
  },
  {
    id: "experienced",
    name: "Experienced Professional",
    description: "For candidates with one or more previous jobs to showcase.",
    icon: "💼",
    build: () => ({
      ...emptyResume(),
      education: [
        {
          id: newId("edu"),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      experience: [
        {
          id: newId("exp"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
        {
          id: newId("exp"),
          title: "",
          role: "",
          link: "",
          date: "",
          bullets: [""],
        },
      ],
      projects: [],
      skills: "",
    }),
  },
];
