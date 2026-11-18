"use client";

import { useEffect } from "react";

const TRAIL = "photo-trail";

/**
 * ← / → for previous/next photo, Esc to go back.
 * Previous/next replace the history entry, so one step back always returns to the reel, at the
 * frame the visitor opened. Visitors who arrived from elsewhere go to /#photos instead.
 */
export function PhotoKeys({ prev, next, back }: { prev: string; next: string; back: string }) {
  useEffect(() => {
    let fromReel = false;
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === location.origin) {
        fromReel =
          ref.pathname === "/" || (ref.pathname.startsWith("/photos/") && sessionStorage.getItem(TRAIL) === "1");
      }
      sessionStorage.setItem(TRAIL, fromReel ? "1" : "0");
    } catch {
      /* storage blocked: fall back to plain links */
    }

    const swap = (href: string) => window.location.replace(href);
    const goBack = () => {
      if (fromReel && history.length > 1) history.back();
      else window.location.assign(back);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable], [role='dialog']")) return;
      if (e.key === "ArrowLeft") swap(prev);
      else if (e.key === "ArrowRight") swap(next);
      else if (e.key === "Escape") goBack();
    };
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-nav]");
      if (!link) return;
      e.preventDefault();
      if (link.dataset.nav === "back") goBack();
      else swap(link.href);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [prev, next, back]);

  return null;
}
