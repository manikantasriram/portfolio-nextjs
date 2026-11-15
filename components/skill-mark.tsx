import Image from "next/image";
import type { SkillIcon } from "@/lib/content";

/** A tool's logo: an SVG file, a lettered badge, or a small inline mark. Used by Skills and Projects. */
export function SkillMark({ icon, size = 28 }: { icon: SkillIcon; size?: number }) {
  switch (icon.kind) {
    case "icon":
      return (
        <Image
          src={`/skills/${icon.file}.svg`}
          width={size}
          height={size}
          alt=""
          className={icon.invert ? "inv" : undefined}
        />
      );
    case "badge":
      return (
        <span
          className={`bd ${icon.small ? "small" : ""}`}
          style={{ "--bc": icon.color, "--b": icon.bg } as React.CSSProperties}
          aria-hidden="true"
        >
          {icon.text}
        </span>
      );
    case "inline":
      return icon.mark === "claude" ? (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <g stroke="#D97757" strokeWidth="3.2" strokeLinecap="round">
            <path d="M16 4v24M4 16h24M7.5 7.5l17 17M24.5 7.5l-17 17" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#1B1F2A" stroke="#3A4052" />
          <path d="M10 8l14 7-6 2-2 6z" fill="#fff" />
        </svg>
      );
  }
}
