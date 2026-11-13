import { downloadResume, openExternal, scrollToSection, sendEmail } from "@/lib/actions";
import { about, contact, education, experience, hero, projects, skillGroups } from "@/lib/content";
import { sections, site } from "@/lib/site";
import { toggleTheme } from "@/lib/theme";

export interface TermLine {
  text: string;
  tone?: "ok" | "acc" | "warn" | "ink";
}

export interface TermResult {
  lines: TermLine[];
  /** Side effect to run after the output is printed (scroll, open a link, ...). */
  effect?: () => void;
  clear?: boolean;
}

const ink = (text: string): TermLine => ({ text, tone: "ink" });
const ok = (text: string): TermLine => ({ text, tone: "ok" });
const acc = (text: string): TermLine => ({ text, tone: "acc" });
const warn = (text: string): TermLine => ({ text, tone: "warn" });
const dim = (text: string): TermLine => ({ text });

const ids = sections.map((s) => s.id) as readonly string[];
/** Accepts "skills", "skills.json", "~/skills" ... and returns the section id. */
const resolveSection = (name: string) => {
  const clean = name.replace(/^[~./]+|\/+$/g, "");
  return sections.find((s) => s.id === clean || s.file === clean)?.id;
};

const goTo = (id: string): TermResult => ({
  lines: [dim(`~/${sections.find((s) => s.id === id)?.file ?? id}`)],
  effect: () => scrollToSection(id),
});

const help: TermLine[] = [
  acc("available commands"),
  ink("whoami · ls · cd <section> · cat <file>"),
  ink("git log · projects · skills · education"),
  ink("contact · email · open github|linkedin"),
  ink("resume · theme · clear"),
];

/** Short answers that point at a section; the section itself holds the full content. */
const summaries: Record<string, () => TermLine[]> = {
  about: () => [ink(about.tenure), dim("cd about for the background and how I build")],
  experience: () => [
    ...experience.flatMap((role) => [
      acc(`${role.ref.label} · ${role.company} · ${role.dates}`),
      ink(`  ${role.title}`),
    ]),
    dim("cd experience for the full log"),
  ],
  projects: () => projects.flatMap((p) => [acc(p.name), ink(`  ${p.stack.join(" · ")}`)]),
  skills: () =>
    skillGroups.slice(0, 3).flatMap((g) => [
      acc(g.title.toLowerCase()),
      ink(`  ${g.skills.map((s) => s.name).join(", ")}`),
    ]),
  education: () => [
    acc(education.school),
    ink(`  ${education.degree}`),
    dim(`  ${education.dates}`),
  ],
  contact: () => [
    ok(contact.availability),
    ink(site.email),
    ink(site.linkedin.replace("https://", "")),
    ink(site.github.replace("https://", "")),
  ],
};

/** The hero terminal. Every answer is built from lib/content.ts, the same data the page shows. */
export function runCommand(raw: string): TermResult {
  const input = raw.trim().replace(/\s+/g, " ");
  const cmd = input.toLowerCase();
  if (!cmd) return { lines: [] };

  if (cmd === "help" || cmd === "?" || cmd === "man") return { lines: help };
  if (cmd === "clear" || cmd === "cls") return { lines: [], clear: true };

  if (cmd === "whoami") {
    return { lines: [ink(`${site.name} · ${hero.role} · ${hero.location}`)] };
  }

  if (cmd === "ls" || cmd === "ls -la" || cmd === "ls -a") {
    return { lines: [acc(sections.map((s) => s.file).join("  ")), ink(site.resumeFile)] };
  }

  if (cmd === "pwd") return { lines: [ink("/home/manikanta")] };

  if (cmd === "cd" || cmd === "cd ~" || cmd === "cd /" || cmd === "top" || cmd === "home") {
    return { lines: [dim("~")], effect: () => scrollToSection("top") };
  }

  if (cmd.startsWith("cd ")) {
    const id = resolveSection(cmd.slice(3));
    return id ? goTo(id) : { lines: [warn(`cd: no such directory: ${input.slice(3)}`)] };
  }

  if (cmd.startsWith("cat ")) {
    const name = cmd.slice(4);
    if (name === "resume.pdf" || name === site.resumeFile.toLowerCase()) {
      return { lines: [ok(`downloading ${site.resumeFile}`)], effect: downloadResume };
    }
    const id = resolveSection(name);
    return id ? { lines: summaries[id]() } : { lines: [warn(`cat: ${input.slice(4)}: no such file`)] };
  }

  if (cmd === "git log" || cmd === "git log --graph" || cmd === "git log --oneline") {
    return { lines: summaries.experience() };
  }

  if (cmd === "git status") {
    return { lines: [ink("On branch main"), ok("nothing to commit, working tree clean")] };
  }

  if (ids.includes(cmd)) {
    // `about`, `projects`, `skills`, `education` and `contact` print a summary; `experience` navigates.
    return cmd === "experience" ? goTo(cmd) : { lines: summaries[cmd]() };
  }

  // The principles live in about.md now.
  if (cmd === "approach" || cmd === "philosophy") return goTo("about");

  if (cmd === "email" || cmd === "mail") {
    return { lines: [ok(`opening mail to ${site.email}`)], effect: sendEmail };
  }

  if (cmd === "open github" || cmd === "github") {
    return {
      lines: [ok(`opening ${site.github.replace("https://", "")}`)],
      effect: () => openExternal(site.github),
    };
  }

  if (cmd === "open linkedin" || cmd === "linkedin") {
    return {
      lines: [ok(`opening ${site.linkedin.replace("https://", "")}`)],
      effect: () => openExternal(site.linkedin),
    };
  }

  if (cmd === "resume") {
    return { lines: [ok(`downloading ${site.resumeFile}`)], effect: downloadResume };
  }

  if (cmd === "theme") {
    return { lines: [ok("theme toggled")], effect: () => toggleTheme() };
  }

  if (cmd === "python main.py") {
    return { lines: [ok(`✓ rendered ${sections.length} sections`)] };
  }

  if (cmd.startsWith("sudo")) {
    return { lines: [warn("permission denied. try: contact")] };
  }

  if (cmd === "exit" || cmd === "quit") {
    return { lines: [dim("this terminal stays open. try: help")] };
  }

  return { lines: [warn(`command not found: ${input}`), dim("type help for a list")] };
}

export const terminalHints = ["help", "ls", "git log", "cat about.md", "resume"] as const;
