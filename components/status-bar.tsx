"use client";

import { Check, GitBranch } from "lucide-react";
import { sections } from "@/lib/site";
import { useScrollState } from "@/lib/use-active-section";

/** Editor-style status bar (desktop only): the open "file" and scroll position as a line number. */
export function StatusBar() {
  const { section, progress } = useScrollState();
  const file = sections.find((s) => s.id === section)?.file ?? "main.py";
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
        <span>Ln {1 + Math.round(progress * 230)}, Col 1</span>
        <span>UTF-8</span>
      </span>
    </div>
  );
}
