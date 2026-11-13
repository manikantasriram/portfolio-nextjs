import { prepareJump } from "@/lib/lazy-sections";
import { site } from "@/lib/site";

/** Browser-side actions used by the command palette. */

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  prepareJump(id); // exact positions, and a check that the jump arrives
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function downloadResume() {
  const a = document.createElement("a");
  a.href = site.resume;
  a.download = site.resumeFile;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function sendEmail() {
  window.location.href = `mailto:${site.email}`;
}
