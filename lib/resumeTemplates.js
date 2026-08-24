import { emptyResume, newId } from "./defaultResume";

// Ready-to-fill ATS templates covering common applicant profiles.
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
        "Recent [Degree] graduate from [University] with a solid foundation in [Key Skill/Subject]. Hands-on experience with [Skill/Tool] through academic and project work, with strong problem-solving skills and eagerness to contribute to a [Target Role] position.",
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
      experience: [],
      projects: [
        {
          id: newId("proj"),
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
        "[Your Program] student at [University] with hands-on knowledge of [Skill/Tool] gained through coursework and projects. Reliable, eager to learn, and looking to bring this foundation to an On-the-Job Training (OJT) / internship opportunity as a [Target Role].",
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
      experience: [
        {
          id: newId("exp"),
          title: "[On-the-Job Training / Company Name]",
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
      projects: [],
      skills: "[Skill 1]; [Skill 2]; [Skill 3]; [Skill 4]; [Skill 5]",
    }),
  },
  {
    id: "working-student",
    name: "Fresh Grad (Working Student)",
    description: "For new graduates who worked part-time or as a working student.",
    icon: "🧑‍🎓",
    build: () => ({
      ...emptyResume(),
      objective:
        "Recent [Degree] graduate from [University] with hands-on experience as a working student in [Field]. Combines academic training in [Key Skill/Subject] with practical, real-world work experience, ready to bring both to an entry-level [Target Role] position.",
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
      experience: [
        {
          id: newId("exp"),
          title: "[Company Name]",
          role: "[Working Student / Part-Time Role Title]",
          link: "",
          date: "[Month Year] - [Month Year]",
          bullets: [
            "Balanced part-time/working student duties in [department] while completing coursework.",
            "Performed [task/responsibility] using [tools/skills].",
            "Contributed to [team/project], resulting in [measurable outcome].",
          ],
        },
      ],
      projects: [
        {
          id: newId("proj"),
          title: "[Capstone / Academic Project Title]",
          role: "[Your Role, e.g. Team Lead, Developer]",
          link: "",
          date: "[Month Year]",
          bullets: [
            "Describe what the project does and the problem it solves.",
            "List the tools, technologies, or methods you used.",
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
        "Results-driven [Your Job Title] with [X] years of experience in [Industry/Field]. Proven expertise in [Key Skill], with a track record of [Notable Achievement/Metric]. Ready to bring this experience to help [Target Company/Role] achieve [Goal].",
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
      projects: [],
      skills: "[Skill 1]; [Skill 2]; [Skill 3]; [Skill 4]; [Skill 5]; [Skill 6]",
    }),
  },
];
