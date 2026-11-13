"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/site";

export interface ScrollState {
  /** id of the section currently in view, or "home" above the first one */
  section: string;
  /** 0..1 scroll progress through the page */
  progress: number;
}

const initial: ScrollState = { section: "home", progress: 0 };

/** Tracks which section is in view, throttled to one update per animation frame. */
export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>(initial);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;

    const update = () => {
      frame = 0;
      let section = "home";
      const line = window.innerHeight * 0.4;
      for (const el of els) {
        if (el.getBoundingClientRect().top < line) section = el.id;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setState((prev) =>
        prev.section === section && Math.abs(prev.progress - progress) < 0.002
          ? prev
          : { section, progress },
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return state;
}
