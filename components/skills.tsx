import { skillGroups } from "@/lib/content";
import { SkillMark } from "./skill-mark";

/** JSON-style key for a group title: "Backend and data" -> "backend_and_data". */
const key = (title: string) => title.toLowerCase().replace(/\s+/g, "_");

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
          <ul className="stack stack-lg" aria-label={group.title}>
            {group.skills.map((s, j) => (
              <li
                key={s.name}
                className="tech"
                tabIndex={0}
                data-item=""
                style={{ zIndex: group.skills.length - j }}
              >
                <span className="tech-orb" aria-hidden="true">
                  <SkillMark icon={s.icon} size={24} />
                </span>
                <span className="tech-name">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
