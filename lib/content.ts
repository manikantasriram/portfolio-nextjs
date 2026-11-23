/** All the page content in one place. Components and JSON-LD read from here. */

export const hero = {
  /** The middle phrase is underlined. */
  tagline: ["Pixel-perfect interfaces.", "Rock-solid APIs.", "One developer who ships it all."],
} as const;

export const about = {
  tenure: "3+ years of production experience",
  background:
    "React and TypeScript on the front, FastAPI and PostgreSQL behind it. I spent three years building for global hospitality brands, where a layout that breaks in Outlook isn't an option. Now I take products from first sketch to production.",
} as const;

export const contact = {
  availability: "open to full stack roles in Hyderabad and remote",
} as const;

export type CommitType = "feat" | "perf" | "fix";

export interface Commit {
  hash: string;
  type: CommitType;
  text: string;
}

export interface Role {
  company: string;
  title: string;
  dates: string;
  /** Plain location text, or a link shown after the dates. */
  location?: string;
  link?: { href: string; label: string };
  ref: { label: string; tone: "main" | "branch" };
  commits: Commit[];
}

export const experience: Role[] = [
  {
    company: "Cendyn",
    title: "Software Engineer, HTML Specialist",
    dates: "Apr 2023 – Jul 2026",
    location: "Hyderabad, India",
    ref: { label: "main", tone: "main" },
    commits: [
      {
        hash: "a3f9c1e",
        type: "feat",
        text: "Delivered 20+ monthly UI and email template projects for global hospitality brands, owning each from requirement intake to release.",
      },
      {
        hash: "7b21d4a",
        type: "feat",
        text: "Converted Figma and Adobe XD mockups into responsive, cross-browser interfaces with designers, product managers and QA.",
      },
      {
        hash: "5c8e0f2",
        type: "perf",
        text: "Built React and TypeScript components plus a reusable HTML and SASS library, cutting new-template time by an estimated 25%.",
      },
      {
        hash: "e19a7b3",
        type: "feat",
        text: "Integrated 300+ CRM rate and room-type codes into templates with conditional logic, JSON payloads and third-party APIs.",
      },
      {
        hash: "2d64c8b",
        type: "fix",
        text: "Resolved recurring Outlook and MSO rendering defects and responsive breakage on a subscription preference center.",
      },
    ],
  },
  {
    company: "Gadgetbytes",
    title: "Freelance Video Editor",
    dates: "Feb 2022 – Apr 2024",
    link: { href: "https://www.instagram.com/gadgetbytes/", label: "@gadgetbytes on Instagram" },
    ref: { label: "freelance", tone: "main" },
    commits: [
      {
        hash: "9d4e2a1",
        type: "feat",
        text: "Edited videos for the Gadgetbytes Instagram page for over two years, taking each one from raw footage to the final published cut.",
      },
      {
        hash: "4b7c3e8",
        type: "feat",
        text: "Cut, paced and sequenced footage in Adobe Premiere Pro to keep short-form videos tight and easy to watch.",
      },
      {
        hash: "c82f1d6",
        type: "feat",
        text: "Added motion graphics and animated titles in Adobe After Effects.",
      },
      {
        hash: "1e5a9b0",
        type: "feat",
        text: "Created cover and thumbnail graphics in Adobe Photoshop.",
      },
    ],
  },
];

export interface Project {
  name: string;
  description: string;
  stack: string[];
  /** "live" = deployed, "in progress" = still being built. */
  status?: "live" | "in progress";
  links?: { demo?: string; code?: string };
}

export const projects: Project[] = [
  {
    name: "Hotel Rate & Booking Manager",
    description:
      "A full stack app for managing hotels, room types, rate plans and bookings, with admin and staff roles. Sortable, filterable data grids, optimistic updates, JWT auth and a documented REST API. Availability is checked against the busiest night of each stay, and a database row lock stops two people from booking the last room.",
    stack: [
      "React",
      "TypeScript",
      "TanStack Query",
      "Tailwind CSS",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Docker",
      "Pytest",
      "Vitest",
    ],
    status: "live",
    links: {
      demo: "https://hotel-booking-manager.vercel.app",
      code: "https://github.com/manikantasriram/hotel-booking-manager",
    },
  },
  {
    name: "NexusFlow — Multi-Tenant B2B Project & Document Intelligence SaaS",
    description:
      "A B2B SaaS where organisations manage projects, tasks and documents in one workspace, with owner, admin and member roles. Planned scope: every query scoped to the organisation and covered by tenant-isolation tests, optimistic Kanban updates, Redis caching and rate limiting, rotating JWT refresh tokens, and Docker with GitHub Actions CI/CD.",
    stack: [
      "React",
      "TypeScript",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "Redis",
      "Docker",
      "GitHub Actions",
    ],
    status: "in progress",
  },
];

export const approach = [
  {
    title: "Accessible by default",
    text: "Semantic HTML, WCAG-aware markup and visible focus states come first, not as an afterthought.",
  },
  {
    title: "Reliable across clients",
    text: "Interfaces and emails are checked across browsers and email clients, including Outlook and MSO quirks.",
  },
  {
    title: "Reusable components",
    text: "Shared component and template libraries with consistent class naming keep new work fast and easy to maintain.",
  },
  {
    title: "Typed and tested",
    text: "TypeScript, Jest, React Testing Library and Pytest, with GitHub Actions running the checks.",
  },
  {
    title: "Owned end to end",
    text: "From requirement intake and code review to release and live production support.",
  },
  {
    title: "Clear communication",
    text: "Technical issues explained plainly to designers, QA and non-technical stakeholders.",
  },
];

/**
 * icon:   SVG in /public/skills
 * badge:  two-letter badge drawn in CSS
 * inline: small inline SVG mark
 */
export type SkillIcon =
  | { kind: "icon"; file: string; invert?: boolean }
  | { kind: "badge"; text: string; color: string; bg: string; small?: boolean }
  | { kind: "inline"; mark: "claude" | "cursor" };

export interface Skill {
  name: string;
  icon: SkillIcon;
}

const icon = (file: string, invert = false): SkillIcon => ({ kind: "icon", file, invert });
const badge = (text: string, color: string, bg: string, small = false): SkillIcon => ({
  kind: "badge",
  text,
  color,
  bg,
  small,
});

export const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: icon("react") },
      { name: "TypeScript", icon: icon("typescript") },
      { name: "JavaScript", icon: icon("javascript") },
      { name: "HTML5", icon: icon("html5") },
      { name: "CSS3", icon: icon("css3") },
      { name: "Tailwind CSS", icon: icon("tailwindcss") },
    ],
  },
  {
    title: "Backend and data",
    skills: [
      { name: "Python", icon: icon("python") },
      { name: "FastAPI", icon: icon("fastapi") },
      { name: "PostgreSQL", icon: icon("postgresql") },
      { name: "Redis", icon: icon("redis") },
      { name: "GraphQL", icon: icon("graphql") },
      { name: "Docker", icon: icon("docker") },
    ],
  },
  {
    title: "Testing and workflow",
    skills: [
      { name: "Git", icon: icon("git") },
      { name: "GitHub", icon: icon("github", true) },
      { name: "Vercel", icon: icon("vercel", true) },
      { name: "Jest", icon: icon("jest") },
      { name: "Pytest", icon: icon("pytest") },
      { name: "Jira", icon: icon("jira") },
      { name: "Azure DevOps", icon: icon("azuredevops") },
    ],
  },
  {
    title: "Design and creative",
    skills: [
      { name: "Figma", icon: icon("figma") },
      { name: "Adobe XD", icon: badge("Xd", "#FF61F6", "#470137") },
      { name: "Photoshop", icon: badge("Ps", "#31A8FF", "#001E36") },
      { name: "Illustrator", icon: badge("Ai", "#FF9A00", "#330000") },
      { name: "Premiere Pro", icon: badge("Pr", "#EA77FF", "#00005B") },
      { name: "After Effects", icon: badge("Ae", "#9999FF", "#00005B") },
      { name: "Photopea", icon: badge("Pp", "#7FD1FF", "#18253A") },
    ],
  },
  {
    title: "AI tools",
    skills: [
      { name: "Claude", icon: { kind: "inline", mark: "claude" } },
      { name: "ChatGPT", icon: icon("chatgpt", true) },
      { name: "Cursor", icon: { kind: "inline", mark: "cursor" } },
      { name: "Ollama", icon: icon("ollama", true) },
    ],
  },
];

/** Tools that appear in project stacks but not in the Skills section. */
const stackOnlyIcons: Record<string, SkillIcon> = {
  "TanStack Query": icon("tanstack"),
  Zustand: icon("zustand"),
  SQLAlchemy: icon("sqlalchemy"),
  Vitest: icon("vitest"),
  "GitHub Actions": icon("github", true),
};

/** The logo for a tool named in a project's stack: the Skills icon if there is one, else a badge. */
export function stackIcon(name: string): SkillIcon {
  for (const group of skillGroups) {
    const skill = group.skills.find((s) => s.name === name);
    if (skill) return skill.icon;
  }
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return stackOnlyIcons[name] ?? badge(initials || "?", "#fff", "#55627D", true);
}

export const education = {
  school: "Sri Vasavi Engineering College",
  degree: "Bachelor of Technology, Electronics and Communications Engineering",
  dates: "2016 – 2020",
  location: "Tadepalligudem, India",
};

/**
 * Adding a photo: put the original in public/images/photos/full/<slug>.jpg, run `npm run photos`,
 * then add an entry here (`full` is the original's pixel size).
 */
export interface Photo {
  slug: string;
  title: string;
  /** Used for the filter chips and the frame label. */
  tag: string;
  caption: string;
  alt: string;
  full: { width: number; height: number };
}

export const photography = {
  intro:
    "Photography is where I slow down. Away from the screen, a camera teaches me to wait for the light, look twice and fall for what most people walk past: the pattern hiding in a plastic chair, a spider signing its web, a temple tower glowing against the night. Every frame here is a moment that made me stop, breathe and press the shutter.",
  instagram: { handle: "travelwithmanik", url: "https://instagram.com/travelwithmanik" },
  vsco: { handle: "manikantasriram", url: "https://vsco.co/manikantasriram/" },
  photos: [
    {
      slug: "charminar",
      title: "Charminar, after dark",
      tag: "architecture",
      caption: "Four minarets and one clock. Four centuries of Hyderabad, holding still for a second.",
      alt: "Charminar in Hyderabad lit up at night against a deep blue sky, seen from below",
      full: { width: 1170, height: 1560 },
    },
    {
      slug: "macaw",
      title: "Red-and-green macaw",
      tag: "birds",
      caption: "Every colour turned all the way up. Nature never worried about a design system.",
      alt: "A red-and-green macaw with turquoise wings perched on a wooden bar inside an aviary",
      full: { width: 1000, height: 2000 },
    },
    {
      slug: "raja-gopuram",
      title: "Raja Gopuram",
      tag: "architecture",
      caption: "Arunachaleswarar Temple, lit tier by tier, like a page that loads from the bottom up.",
      alt: "The towering Raja Gopuram of Arunachaleswarar Temple outlined in lights at night",
      full: { width: 1500, height: 2000 },
    },
    {
      slug: "ambedkar-statue",
      title: "Dr. B. R. Ambedkar statue",
      tag: "architecture",
      caption: "Lit gold against a black sky, one hand pointing ahead. Some subjects ask you to look up.",
      alt: "A giant statue of Dr. B. R. Ambedkar lit gold at night, holding a book and pointing upward",
      full: { width: 1125, height: 2000 },
    },
    {
      slug: "chai",
      title: "Chai, from above",
      tag: "still life",
      caption: "A cup of tea at the centre of a plastic chair's pattern. Grids aren't only a CSS thing.",
      alt: "Top-down view of a frothy cup of tea in the centre of a plastic chair's lattice pattern",
      full: { width: 1125, height: 2000 },
    },
    {
      slug: "signature-spider",
      title: "Signature spider",
      tag: "macro",
      caption: "It weaves its own zigzags into the web. Every builder leaves a signature.",
      alt: "Close-up of a yellow and black signature spider in its web, with zigzag silk bands",
      full: { width: 1500, height: 2000 },
    },
    {
      slug: "reclining-vishnu",
      title: "Reclining Vishnu",
      tag: "devotion",
      caption: "Stone that never moves, water that never stops. Good contrast is everything.",
      alt: "Black stone statue of a reclining Vishnu with marigold garlands, in a green temple pond",
      full: { width: 1500, height: 2000 },
    },
    {
      slug: "wings",
      title: "Wings, up close",
      tag: "macro",
      caption: "Ink-black and ice-blue, resting in an open palm. A pattern no stylesheet could fake.",
      alt: "A black butterfly with pale blue, black-spotted hind wings resting on an open palm",
      full: { width: 1000, height: 2000 },
    },
  ] satisfies Photo[],
};
