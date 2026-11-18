"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { applyTheme, getTheme, hasStoredTheme, subscribeTheme, toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  // null during prerender; the real theme is read from <html> after hydration.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);

  // follow the OS theme until the user picks one
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!hasStoredTheme()) applyTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <button
      type="button"
      className="ib theme-btn"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label="Dark theme"
      aria-pressed={theme === null ? undefined : theme === "dark"}
      title="Toggle light and dark theme"
    >
      {/* render both icons and let CSS pick, so nothing flips on hydration */}
      <Sun className="sun" size={18} strokeWidth={1.8} aria-hidden="true" />
      <Moon className="moon" size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
