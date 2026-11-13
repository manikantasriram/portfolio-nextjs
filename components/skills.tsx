import Image from "next/image";
import { skillGroups, type Skill } from "@/lib/content";

function SkillMark({ icon }: { icon: Skill["icon"] }) {
  switch (icon.kind) {
    case "icon":
      return (
        <Image
          src={`/skills/${icon.file}.svg`}
          width={28}
          height={28}
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

/** JSON-style key for a group title: "Backend and data" -> "backend_and_data". */
const key = (title: string) => title.toLowerCase().replace(/\s+/g, "_");

/** Skills laid out like a JSON file: each group is a key, its tools are the value. */
export function SkillsGrid() {
  return (
    <div className="sgroups">
      {skillGroups.map((group) => (
        <div key={group.title} className="sg" data-stagger="">
          <i className="rule" aria-hidden="true" data-line="" />
          <h3 data-item="">
            <span className="skey" aria-hidden="true">
              &quot;{key(group.title)}&quot;:
            </span>
            <span className="sr-only">{group.title}</span>
          </h3>
          <ul className="tiles">
            {group.skills.map((s) => (
              <li key={s.name} className="tile" data-item="" data-tilt="">
                <span className="orb">
                  <SkillMark icon={s.icon} />
                </span>
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
