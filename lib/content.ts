/**
 * Single source of truth for all professional content, copied verbatim from the original site.
 *
 * Each fact lives in exactly one export and is shown in exactly one section:
 *   hero        name (lib/site.ts), tagline
 *   about       tenure, background and development philosophy (`about` + `approach`)
 *   experience  employers, titles, dates, achievements
 *   projects    project names, descriptions, stacks
 *   skills      tools
 *   education   degree
 *   contact     availability, email and profiles (lib/site.ts)
 *
 * Components, the command palette and JSON-LD all read from here.
 */

export const hero = {
  /** The middle phrase is underlined. */
  tagline: ["Pixel-perfect interfaces.", "Rock-solid APIs.", "One developer who ships it all."],
} as const;

export const about = {
  tenure: "3+ years of production experience",
  background:
    "React and TypeScript on the front, FastAPI and PostgreSQL behind it. Three years of building for global hospitality brands, where a layout that breaks in Outlook is not an option, now taking products from first sketch to production.",
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
    dates: "Apr 2023 – Apr 2026",
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
    ref: { label: "freelance", tone: "branch" },
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
  /** Shown as a badge. "in progress" means the project is still being built, not shipped. */
  status?: "in progress";
}

export const projects: Project[] = [
  {
    name: "Hotel Rate & Booking Manager",
    description:
      "A full stack app for managing hotels, room types, rate plans and bookings. Planned scope: sortable, filterable data grids, optimistic updates, JWT auth with role-based access and a documented REST API, deployed with Docker Compose.",
    stack: ["React", "TypeScript", "TanStack Query", "FastAPI", "PostgreSQL", "Docker"],
    status: "in progress",
  },
  {
    name: "AI Email Template Assistant",
    description:
      "Turns a text brief into a responsive HTML email template, streamed to the UI over Server-Sent Events. Planned scope: a validator that flags cross-client issues before save, and full version history.",
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "LLM API"],
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
 * Skill icon sources:
 * - `icon`: an SVG in /public/skills (extracted from the original site's sprite)
 * - `badge`: a two-letter product badge, drawn in CSS with the brand colours
 * - `inline`: a small hand-drawn mark (kept from the original site)
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
      { name: "Sass", icon: icon("sass") },
    ],
  },
  {
    title: "Backend and data",
    skills: [
      { name: "Python", icon: icon("python") },
      { name: "FastAPI", icon: icon("fastapi") },
      { name: "PostgreSQL", icon: icon("postgresql") },
      { name: "Docker", icon: icon("docker") },
    ],
  },
  {
    title: "Testing and workflow",
    skills: [
      { name: "Git", icon: icon("git") },
      { name: "GitHub", icon: icon("github", true) },
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
      { name: "ChatGPT", icon: badge("GPT", "#fff", "#10A37F", true) },
      { name: "Cursor", icon: { kind: "inline", mark: "cursor" } },
    ],
  },
];

export const education = {
  school: "Sri Vasavi Engineering College",
  degree: "Bachelor of Technology, Electronics and Communications Engineering",
  dates: "2016 – 2020",
  location: "Tadepalligudem, India",
};
