"use client";

import { useEffect } from "react";

/** ← / → for previous/next photo, Esc to go back. */
export function PhotoKeys({ prev, next, back }: { prev: string; next: string; back: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable], [role='dialog']")) return;
      if (e.key === "ArrowLeft") window.location.assign(prev);
      else if (e.key === "ArrowRight") window.location.assign(next);
      else if (e.key === "Escape") window.location.assign(back);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, back]);

  return null;
}
