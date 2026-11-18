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
          <ul className="stack" aria-label={group.title}>
            {group.skills.map((s) => (
              <li key={s.name} className="tech" data-item="">
                <span className="tech-ic" aria-hidden="true">
                  <SkillMark icon={s.icon} size={20} />
                </span>
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
