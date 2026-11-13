"use client";

import { Check, GitBranch } from "lucide-react";
import { useEffect, useRef } from "react";
import { subscribeScroll, useActiveSection } from "@/lib/scroll-store";
import { sections } from "@/lib/site";

/** Editor-style status bar (desktop only): the open "file" and scroll position as a line number. */
export function StatusBar() {
  const section = useActiveSection();
  const lineRef = useRef<HTMLSpanElement>(null);
  const file = sections.find((s) => s.id === section)?.file ?? "main.py";

  // The line number changes on every scroll frame, so it is written to the DOM directly.
  useEffect(
    () =>
      subscribeScroll(({ progress }) => {
        if (lineRef.current) lineRef.current.textContent = `Ln ${1 + Math.round(progress * 230)}, Col 1`;
      }),
    [],
  );

  return (
    <div className="sb" aria-hidden="true">
      <span>
        <span className="br">
          <GitBranch strokeWidth={1.8} />
          main
        </span>
        <span>
          <Check strokeWidth={2} />0 errors
        </span>
      </span>
      <span>
        <span>~/{file}</span>
        <span ref={lineRef}>Ln 1, Col 1</span>
        <span>UTF-8</span>
      </span>
    </div>
  );
}
