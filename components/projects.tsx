import { ArrowUpRight } from "lucide-react";
import { projects, stackIcon } from "@/lib/content";
import { SkillMark } from "./skill-mark";

export function ProjectList() {
  const total = String(projects.length).padStart(2, "0");
  return (
    <ol className="plist">
      {projects.map((p, i) => (
        <li key={p.name} className="prow" data-scene="project">
          <i className="rule" aria-hidden="true" />
          <p className="pidx" aria-hidden="true">
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>/ {total}</span>
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
            <ul className="stack" aria-label={`${p.name} tech stack`}>
              {p.stack.map((t) => (
                <li key={t} className="tech">
                  <span className="tech-ic" aria-hidden="true">
                    <SkillMark icon={stackIcon(t)} size={20} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
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
