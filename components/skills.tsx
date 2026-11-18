import { skillGroups } from "@/lib/content";
import { SkillMark } from "./skill-mark";

/** JSON-style key for a group title: "Backend and data" -> "backend_and_data". */
const key = (title: string) => title.toLowerCase().replace(/\s+/g, "_");

/** Each group's tools as overlapping logos; the name shows on hover or focus. */
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
          <ul className="orbs" aria-label={group.title}>
            {group.skills.map((s, j) => (
              <li
                key={s.name}
                className="orb"
                tabIndex={0}
                data-item=""
                style={{ zIndex: group.skills.length - j }}
              >
                <span className="orb-ic" aria-hidden="true">
                  <SkillMark icon={s.icon} size={24} />
                </span>
                <span className="orb-name">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
