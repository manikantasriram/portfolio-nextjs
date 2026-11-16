export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage blocked (private mode): the theme still applies for this visit */
  }
}

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

/**
 * Switches theme. Where the View Transitions API is available (and motion is allowed), the new
 * theme is revealed as a circle growing from `origin` (the toggle button).
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  const root = document.documentElement;
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => ViewTransitionLike;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof doc.startViewTransition !== "function" || reduce) {
    setTheme(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // Colour transitions are paused so the "new" snapshot is taken in its final colours.
  root.classList.add("theme-switching");
  const transition = doc.startViewTransition(() => setTheme(next));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 560, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("theme-switching"));
}

export function hasStoredTheme(): boolean {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === "dark" || t === "light";
  } catch {
    return false;
  }
}

/** Notifies when <html data-theme> changes (from any toggle). */
export function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
