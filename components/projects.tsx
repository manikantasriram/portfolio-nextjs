import { ArrowUpRight } from "lucide-react";
import { projects, stackIcon } from "@/lib/content";
import { SkillMark } from "./skill-mark";

export function ProjectList() {
  return (
    <ol className="plist">
      {projects.map((p, i) => (
        <li key={p.name} className="prow" data-scene="project">
          <p className="pidx" aria-hidden="true">
            <b>{String(i + 1).padStart(2, "0")}</b>
          </p>
          <h3>{p.name}</h3>
          <div className="pbody">
            {p.status && (
              <p className="pstatus" data-status={p.status}>
                <i aria-hidden="true" />
                {p.status}
              </p>
            )}
            <p>{p.description}</p>
            {/* same overlapping logos as the Skills section; the name shows on hover, focus or tap */}
            <div className="pstack">
              <ul className="orbs" aria-label={`${p.name} tech stack`}>
                {p.stack.map((t, j) => (
                  <li key={t} className="orb" tabIndex={0} style={{ zIndex: p.stack.length - j }}>
                    <span className="orb-ic" aria-hidden="true">
                      <SkillMark icon={stackIcon(t)} size={24} />
                    </span>
                    <span className="orb-name">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {p.links && (
              <p className="plinks">
                {p.links.demo && (
                  <a href={p.links.demo} target="_blank" rel="noopener noreferrer">
                    Live demo <span className="sr-only">(opens in a new tab)</span>
                    <ArrowUpRight className="i-out" strokeWidth={2} aria-hidden="true" />
                  </a>
                )}
                {p.links.code && (
                  <a href={p.links.code} target="_blank" rel="noopener noreferrer">
                    Source code <span className="sr-only">(opens in a new tab)</span>
                    <ArrowUpRight className="i-out" strokeWidth={2} aria-hidden="true" />
                  </a>
                )}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
