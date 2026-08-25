import { Document, Page, Text, View, Link, Image, StyleSheet } from "@react-pdf/renderer";

const BLUE = "#1e3a8a";
const GRAY = "#374151";
const LIGHT_GRAY = "#4b5563";
const PAGE_HEIGHT = 1122;

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
      <Text style={styles.heading} minPresenceAhead={20}>
        {heading}
      </Text>
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
  const pages = buildPages(data);

  return (
    <Document title={data.fullName ? `${data.fullName} - Resume` : "Resume"}>
      {pages.map((page, index) => (
        <Page key={index} size="A4" style={styles.page} wrap>
          {index === 0 ? renderHeader(page.meta) : null}
          {page.items.map((item) => (
            <View key={item.key}>{renderItem(item)}</View>
          ))}
        </Page>
      ))}
    </Document>
  );
}

function renderHeader(meta) {
  const { fullName, jobTitle, contactLine, photo } = meta;

  return (
    <View style={styles.headerRow}>
      <View style={{ flex: 1, paddingRight: photo ? 84 : 0 }}>
        <Text style={[styles.name, photo ? { textAlign: "left" } : null]}>{(fullName || "YOUR NAME").toUpperCase()}</Text>
        {jobTitle ? <Text style={[styles.jobTitle, photo ? { textAlign: "left" } : null]}>{jobTitle}</Text> : null}
        {contactLine ? (
          <Text
            style={[
              styles.contact,
              photo
                ? { marginTop: 3, paddingVertical: 3, borderTopWidth: 0, borderBottomColor: BLUE, textAlign: "left" }
                : null,
            ]}
          >
            {contactLine}
          </Text>
        ) : null}
      </View>
      {photo ? <Image src={photo} style={styles.photo} /> : null}
    </View>
  );
}

function renderItem(item) {
  if (item.type === "objective") {
    return (
      <Section heading={item.heading}>
        <Text style={styles.paragraph}>{item.value}</Text>
      </Section>
    );
  }

  if (item.type === "education") {
    return (
      <Section heading="Education">
        {item.entries.map((edu) => (
          <View key={edu.id} style={styles.entry} wrap={false}>
            <View style={styles.row}>
              <Text style={[styles.bold, styles.leftCol]}>{edu.degree}</Text>
              <Text style={[styles.bold, styles.rightCol]}>{[edu.startDate, edu.endDate].filter(Boolean).join(" - ")}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.italic, styles.leftCol]}>{edu.school}</Text>
              <Text style={[styles.italic, styles.rightCol]}>{edu.location}</Text>
            </View>
          </View>
        ))}
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
        <Bullet>{item.value}</Bullet>
      </Section>
    );
  }

  if (item.type === "certifications") {
    const completeEntries = item.entries.filter((entry) => entry.title);
    if (!completeEntries.length) return null;
    return (
      <Section heading="Certifications">
        {completeEntries.map((entry) => (
          <Bullet key={entry.id}>
            <Text style={styles.bold}>{entry.title}</Text>
            {[entry.organization, entry.date].filter(Boolean).length
              ? ` - ${[entry.organization, entry.date].filter(Boolean).join(", ")}`
              : ""}
          </Bullet>
        ))}
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
    <View style={styles.entry}>
      <View style={styles.row}>
        <Text style={[styles.bold, styles.leftCol]}>{entry.title}</Text>
        <Text style={[styles.bold, styles.rightCol]}>{entry.date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.italic, styles.leftCol]}>{entry.role}</Text>
        {entry.link ? (
          <Link src={entry.link} style={[styles.italic, styles.rightCol, { color: LIGHT_GRAY }]}>
            {entry.link}
          </Link>
        ) : null}
      </View>
      {entry.bullets?.filter(Boolean).map((bullet, i) => (
        <Bullet key={i}>{bullet}</Bullet>
      ))}
    </View>
  );
}

function buildPages(data) {
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
  const meta = { fullName, jobTitle, contactLine, photo };
  const items = [];

  if (objective?.trim()) {
    items.push({ type: "objective", key: "objective", heading: resumeType === "no-experience" ? "Objective" : "Professional Summary", value: objective });
  }
  if (education.some((e) => e.degree || e.school)) {
    items.push({ type: "education", key: "education", entries: education.filter((e) => e.degree || e.school) });
  }
  if (experience.some((e) => e.title)) {
    items.push({ type: "experience-start", key: "experience-start", heading: resumeType === "no-experience" ? "Internship" : "Experience" });
    experience.filter((e) => e.title).forEach((entry) => items.push({ type: "experience-entry", key: `experience-${entry.id}`, entry }));
  }
  if (skills?.trim()) items.push({ type: "skills", key: "skills", value: skills });
  if (certifications.some((c) => c.title)) items.push({ type: "certifications", key: "certifications", entries: certifications.filter((c) => c.title) });
  if (projects.some((p) => p.title)) {
    items.push({ type: "projects-start", key: "projects-start" });
    projects.filter((p) => p.title).forEach((entry) => items.push({ type: "projects-entry", key: `projects-${entry.id}`, entry }));
  }

  return paginateItems(items, meta);
}

function paginateItems(items, meta) {
  const pageLimit = PAGE_HEIGHT - estimateHeaderHeight(meta) - 120;
  const pages = [];
  let current = [];
  let currentHeight = 0;

  for (const item of items) {
    const height = estimateHeight(item);
    if (current.length && currentHeight + height > pageLimit) {
      pages.push({ meta, items: current });
      current = [];
      currentHeight = 0;
    }
    current.push(item);
    currentHeight += height;
  }

  if (current.length || !pages.length) {
    pages.push({ meta, items: current.length ? current : [{ type: "noop", key: "noop" }] });
  }

  return pages;
}

function estimateHeaderHeight(meta) {
  let height = meta.photo ? 184 : 158;
  if (meta.fullName) height += 28;
  if (meta.jobTitle) height += 18;
  if (meta.contactLine) height += 34;
  return height;
}

function estimateHeight(item) {
  switch (item.type) {
    case "objective":
      return 104;
    case "education":
      return 116 + item.entries.length * 16;
    case "experience-start":
    case "projects-start":
      return 40;
    case "experience-entry":
    case "projects-entry":
      return 116 + (item.entry.bullets?.filter(Boolean).length || 0) * 16;
    case "skills":
      return 76;
    case "certifications":
      return 68 + item.entries.length * 18;
    default:
      return 60;
  }
}

export async function generateResumePdfBlob(data) {
  const { pdf } = await import("@react-pdf/renderer");
  const instance = pdf(<ResumeDocument data={data} />);
  return instance.toBlob();
}
