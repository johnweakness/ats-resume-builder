import { emptyResume, newId } from "./defaultResume";

// Three ready-to-fill ATS templates covering common applicant profiles.
// Bracketed placeholders guide the user on what to replace with their own info.
export const RESUME_TEMPLATES = [
  {
    id: "fresh-grad",
    name: "Fresh Graduate",
    description: "For new graduates with little to no work experience yet.",
    icon: "🎓",
    build: () => ({
      ...emptyResume(),
      objective:
        "Recent [Degree] graduate from [University] seeking an entry-level [Target Role] position to apply my academic knowledge and grow my professional skills in a collaborative environment.",
      education: [
        {
          id: newId("edu"),
          degree: "Bachelor of Science in [Your Program]",
          school: "[Your University]",
          location: "[City, Province]",
          startDate: "[Start Year]",
          endDate: "[Graduation Year]",
        },
      ],
      experienceHeading: "PROJECTS",
      experience: [
        {
          id: newId("exp"),
          title: "[Capstone / Academic Project Title]",
          role: "[Your Role, e.g. Team Lead, Developer]",
          link: "",
          date: "[Month Year]",
          bullets: [
            "Describe what the project does and the problem it solves.",
            "List the tools, technologies, or methods you used.",
            "Highlight a measurable result or what you learned.",
          ],
        },
      ],
      skills: "[Skill 1]; [Skill 2]; [Skill 3]; [Skill 4]; [Skill 5]",
    }),
  },
  {
    id: "ojt",
    name: "OJT / Intern",
    description: "For students applying for on-the-job training or internships.",
    icon: "🧑‍💻",
    build: () => ({
      ...emptyResume(),
      objective:
        "[Your Program] student at [University] seeking an On-the-Job Training (OJT) / internship opportunity as a [Target Role] to apply classroom knowledge and gain hands-on industry experience.",
      education: [
        {
          id: newId("edu"),
          degree: "Bachelor of Science in [Your Program]",
          school: "[Your University]",
          location: "[City, Province]",
          startDate: "[Start Year]",
          endDate: "Expected [Graduation Year]",
        },
      ],
      experienceHeading: "INTERNSHIP / PROJECTS",
      experience: [
        {
          id: newId("exp"),
          title: "[On-the-Job Training / Project Title]",
          role: "[Intern / Trainee]",
          link: "",
          date: "[Month Year] - [Month Year]",
          bullets: [
            "Assisted with [task] under the supervision of [department/team].",
            "Used [tools/technologies] to complete [specific task].",
            "Collaborated with [team] to achieve [result].",
          ],
        },
      ],
      skills: "[Skill 1]; [Skill 2]; [Skill 3]; [Skill 4]; [Skill 5]",
    }),
  },
  {
    id: "experienced",
    name: "Experienced Professional",
    description: "For candidates with one or more previous jobs to showcase.",
    icon: "💼",
    build: () => ({
      ...emptyResume(),
      objective:
        "Results-driven [Your Job Title] with [X] years of experience in [Industry/Field], seeking to leverage proven expertise in [Key Skill] to help [Target Company/Role] achieve [Goal].",
      education: [
        {
          id: newId("edu"),
          degree: "Bachelor of Science in [Your Program]",
          school: "[Your University]",
          location: "[City, Province]",
          startDate: "[Start Year]",
          endDate: "[Graduation Year]",
        },
      ],
      experienceHeading: "EXPERIENCE",
      experience: [
        {
          id: newId("exp"),
          title: "[Company Name]",
          role: "[Job Title]",
          link: "",
          date: "[Month Year] - Present",
          bullets: [
            "Led/managed/delivered [responsibility], resulting in [measurable outcome].",
            "Collaborated with [team/department] to achieve [achievement].",
            "Implemented [process/tool] that improved [metric] by [%].",
          ],
        },
        {
          id: newId("exp"),
          title: "[Previous Company Name]",
          role: "[Job Title]",
          link: "",
          date: "[Month Year] - [Month Year]",
          bullets: [
            "Describe a key responsibility and its outcome.",
            "Describe another achievement with measurable impact.",
          ],
        },
      ],
      skills: "[Skill 1]; [Skill 2]; [Skill 3]; [Skill 4]; [Skill 5]; [Skill 6]",
    }),
  },
];
