import { Document, Page, Text, View, Link, Image, StyleSheet, Font } from "@react-pdf/renderer";

// Text-based PDF (no rasterized images of text) so ATS parsers can read every word.
const BLUE = "#1e3a8a";
const GRAY = "#374151";
const LIGHT_GRAY = "#4b5563";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: GRAY,
  },
  headerRow: {
    position: "relative",
    alignItems: "center",
  },
  photo: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 72,
    height: 72,
    borderRadius: 4,
    objectFit: "cover",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: BLUE,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  jobTitle: {
    marginTop: 4,
    fontSize: 12,
    color: GRAY,
    textAlign: "center",
  },
  contact: {
    marginTop: 12,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: GRAY,
    fontSize: 10,
    color: LIGHT_GRAY,
    textAlign: "center",
  },
  section: {
    marginTop: 14,
  },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: BLUE,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: BLUE,
  },
  sectionBody: {
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  rightCol: {
    flexShrink: 0,
    textAlign: "right",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  italic: {
    fontFamily: "Helvetica-Oblique",
    color: LIGHT_GRAY,
  },
  entry: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
    paddingRight: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 10.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.35,
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 1.45,
    color: GRAY,
  },
});

function Section({ heading, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading} minPresenceAhead={20}>{heading}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>{"\u2022"}</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function ResumeDocument({ data }) {
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
    <Document title={fullName ? `${fullName} - Resume` : "Resume"}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, paddingRight: photo ? 84 : 0 }}>
            <Text style={styles.name}>{(fullName || "YOUR NAME").toUpperCase()}</Text>
            {jobTitle ? <Text style={styles.jobTitle}>{jobTitle}</Text> : null}
            {contactLine ? <Text style={styles.contact}>{contactLine}</Text> : null}
          </View>
          {photo ? <Image src={photo} style={styles.photo} /> : null}
        </View>

        {objective ? (
          <Section heading={resumeType === "no-experience" ? "Objective" : "Professional Summary"}>
            <Text style={styles.paragraph}>{objective}</Text>
          </Section>
        ) : null}

        {education.some((e) => e.degree || e.school) ? (
          <Section heading="Education">
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry} wrap={false}>
                <View style={styles.row}>
                  <Text style={[styles.bold, styles.leftCol]}>{edu.degree}</Text>
                  <Text style={[styles.bold, styles.rightCol]}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.italic, styles.leftCol]}>{edu.school}</Text>
                  <Text style={[styles.italic, styles.rightCol]}>{edu.location}</Text>
                </View>
              </View>
            ))}
          </Section>
        ) : null}

        {experience.some((e) => e.title) ? (
          <Section heading={resumeType === "no-experience" ? "Internship" : "Experience"}>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={[styles.bold, styles.leftCol]}>{exp.title}</Text>
                  <Text style={[styles.bold, styles.rightCol]}>{exp.date}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.italic, styles.leftCol]}>{exp.role}</Text>
                  {exp.link ? (
                    <Link src={exp.link} style={[styles.italic, styles.rightCol, { color: LIGHT_GRAY }]}>
                      {exp.link}
                    </Link>
                  ) : null}
                </View>
                {exp.bullets?.filter(Boolean).map((bullet, i) => (
                  <Bullet key={i}>{bullet}</Bullet>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {skills ? (
          <Section heading="Skills">
            <Bullet>{skills}</Bullet>
          </Section>
        ) : null}

        <CredentialSection heading="Certifications" entries={certifications} />

        {projects.some((p) => p.title) ? (
          <Section heading="Projects">
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                <View style={styles.row}>
                  <Text style={[styles.bold, styles.leftCol]}>{proj.title}</Text>
                  <Text style={[styles.bold, styles.rightCol]}>{proj.date}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.italic, styles.leftCol]}>{proj.role}</Text>
                  {proj.link ? (
                    <Link src={proj.link} style={[styles.italic, styles.rightCol, { color: LIGHT_GRAY }]}>
                      {proj.link}
                    </Link>
                  ) : null}
                </View>
                {proj.bullets?.filter(Boolean).map((bullet, i) => (
                  <Bullet key={i}>{bullet}</Bullet>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

      </Page>
    </Document>
  );
}

function CredentialSection({ heading, entries = [] }) {
  const completeEntries = entries.filter((entry) => entry.title);
  if (!completeEntries.length) return null;

  return (
    <Section heading={heading}>
      {completeEntries.map((entry) => (
        <Bullet key={entry.id}>
          <Text style={styles.bold}>{entry.title}</Text>
          {[entry.organization, entry.date].filter(Boolean).length
            ? ` — ${[entry.organization, entry.date].filter(Boolean).join(", ")}`
            : ""}
        </Bullet>
      ))}
    </Section>
  );
}


export async function generateResumePdfBlob(data) {
  const { pdf } = await import("@react-pdf/renderer");
  const instance = pdf(<ResumeDocument data={data} />);
  return instance.toBlob();
}
