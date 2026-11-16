/** Identity, links and the section map. Professional content lives in lib/content.ts. */
export const site = {
  /** Resolved in next.config.ts (custom domain, Vercel production domain, or the Netlify address). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://manikantasriram.netlify.app",
  name: "Manikanta Sriram",
  firstName: "Manikanta",
  lastName: "Sriram",
  title: "Manikanta Sriram | Full Stack Developer, Hyderabad",
  description:
    "Manikanta Sriram is a full stack developer in Hyderabad, India. 3+ years building React and TypeScript interfaces, now shipping FastAPI and PostgreSQL backends.",
  shortDescription:
    "React, TypeScript and Python (FastAPI) developer with 3+ years of production experience. Hyderabad, India.",
  jobTitle: "Full Stack Developer",
  locality: "Hyderabad",
  country: "IN",
  email: "manikantasriram98@gmail.com",
  github: "https://github.com/manikantasriram",
  linkedin: "https://linkedin.com/in/manekanttasriram",
  resume: "/Manikanta_Sriram_Resume.pdf",
  resumeFile: "Manikanta_Sriram_Resume.pdf",
  ogImage: "/og.png",
  photo: "/images/manikanta-sriram-480.webp",
};

/**
 * The page as a workspace: every section is a "file".
 * Order here is the order on the page; the nav, section headers and status bar all
 * read from this one list.
 */
export const sections = [
  { id: "about", label: "About", file: "about.md", inNav: true },
  { id: "experience", label: "Experience", file: "experience.log", inNav: true },
  { id: "projects", label: "Projects", file: "projects.tsx", inNav: true },
  { id: "skills", label: "Skills", file: "skills.json", inNav: true },
  { id: "education", label: "Education", file: "education.md", inNav: true },
  { id: "photos", label: "Frames", file: "photos.raw", inNav: true },
  { id: "contact", label: "Contact", file: "contact.sh", inNav: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const navLinks = sections.filter((s) => s.inNav);

export function sectionMeta(id: SectionId) {
  const index = sections.findIndex((s) => s.id === id);
  return { ...sections[index], number: String(index + 1).padStart(2, "0") };
}
