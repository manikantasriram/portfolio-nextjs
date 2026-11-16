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
 * Components and JSON-LD all read from here.
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
  /** Shown as a badge: "live" is deployed and usable; "in progress" is still being built. */
  status?: "live" | "in progress";
  /** Where to see it running and read the code. */
  links?: { demo?: string; code?: string };
}

export const projects: Project[] = [
  {
    name: "Hotel Rate & Booking Manager",
    description:
      "A full stack app for managing hotels, room types, rate plans and bookings, with admin and staff roles. Sortable, filterable data grids, optimistic updates, JWT auth and a documented REST API. Availability checks the busiest night of each stay, and a database row lock stops two people booking the last room.",
    stack: ["React", "TypeScript", "TanStack Query", "FastAPI", "PostgreSQL", "Docker"],
    status: "live",
    links: {
      demo: "https://hotel-booking-manager.vercel.app",
      code: "https://github.com/manikantasriram/hotel-booking-manager",
    },
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
      { name: "Netlify", icon: icon("netlify") },
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
    ],
  },
];

/** Tools that appear in project stacks but not in the Skills section. */
const stackOnlyIcons: Record<string, SkillIcon> = {
  "TanStack Query": icon("tanstack"),
  Redis: icon("redis"),
  "LLM API": badge("AI", "#fff", "#7C3AED", true),
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
 * To add a photo:
 *  1. put the original in /public/images/photos/full/<slug>.jpg (shown in the reel at its own
 *     proportions, and served as-is for download)
 *  2. add an entry below; `full` is the original's pixel size
 * Everything else (reel, filters, viewer page, sitemap, prev/next) picks it up automatically.
 */
export interface Photo {
  slug: string;
  title: string;
  /** Genre: drives the filter chips and the frame label. */
  tag: string;
  caption: string;
  alt: string;
  full: { width: number; height: number };
}

/** Off the Clock: photography, with a short caption for each frame. */
export const photography = {
  intro:
    "Photography is where I slow down. Away from the screen, a camera teaches me to wait for the light, look twice and fall for what most people walk past: the pattern hiding in a plastic chair, the patience of a pigeon, a temple tower glowing against the night. Every frame here is a moment that made me stop, breathe and press the shutter.",
  instagram: { handle: "travelwithmanik", url: "https://instagram.com/travelwithmanik" },
  /** Order is the order in the reel. */
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
      slug: "night-train",
      title: "Night train",
      tag: "street",
      caption: "Fans in perfect rows, people in every shape of tired. Symmetry finds you anywhere.",
      alt: "Inside a train coach at night, rows of ceiling fans above blue seats and resting passengers",
      full: { width: 1125, height: 2000 },
    },
    {
      slug: "three-pandas",
      title: "Three pandas",
      tag: "still life",
      caption: "Two bodybuilders and one point guard, posing on a mirror floor. Reflections double the drama.",
      alt: "Three toy pandas, two flexing and one holding a basketball, reflected on a glossy floor",
      full: { width: 1125, height: 2000 },
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
      slug: "jumping-spider",
      title: "Jumping spider",
      tag: "macro",
      caption: "Half a centimetre of curiosity on a grey sleeve, with every big black eye on me.",
      alt: "A tiny pale jumping spider with large black eyes on grey fabric, pink blur behind",
      full: { width: 1000, height: 2000 },
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
      slug: "between-trains",
      title: "Between two trains",
      tag: "street",
      caption: "A sliver of gravel between two trains, both heading somewhere. The quiet before the whistle.",
      alt: "A narrow strip of gravel between a passenger train and a goods train under a hazy sky",
      full: { width: 1000, height: 2000 },
    },
    {
      slug: "ganesh",
      title: "Ganesh, festival scale",
      tag: "devotion",
      caption: "Craning my neck to fit him in the frame: garlands, gold and a blessing hand the size of a door.",
      alt: "A towering, brightly painted Ganesh idol draped in marigold garlands, seen from below",
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
      slug: "looking-up",
      title: "Looking up",
      tag: "nature",
      caption: "Stand at the trunk and look straight up: the branches burst like a firework. Perspective is free.",
      alt: "Looking straight up a tree trunk to branches spreading out like a starburst of green leaves",
      full: { width: 1000, height: 2000 },
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
      slug: "window-guest",
      title: "Window guest",
      tag: "birds",
      caption: "Grey feathers on chipped white bars, coral feet holding on. The city's most patient visitor.",
      alt: "A grey pigeon with coral-red feet perched on a white window grill",
      full: { width: 1125, height: 2000 },
    },
    {
      slug: "wings",
      title: "Wings, up close",
      tag: "macro",
      caption: "Ink-black and ice-blue, resting in an open palm. A pattern no stylesheet could fake.",
      alt: "A black butterfly with pale blue, black-spotted hind wings resting on an open palm",
      full: { width: 1000, height: 2000 },
    },
    {
      slug: "painted-mountain",
      title: "Painted mountain",
      tag: "travel",
      caption: "A mountain built for thrills at Wonderla, its rock grain drawn line by line. Even built stone earns a second look.",
      alt: "Sculpted rock waterfall with ridged orange stone and a rail track under the Wonderla sign",
      full: { width: 1500, height: 2000 },
    },
  ] satisfies Photo[],
};
