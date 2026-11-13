import { projects } from "@/lib/content";

/** Projects as a typographic index: large titles on a ruled list, no cards. */
export function ProjectList() {
  const total = String(projects.length).padStart(2, "0");
  return (
    <ol className="plist">
      {projects.map((p, i) => (
        <li key={p.name} className="prow" data-project="">
          <i className="rule" aria-hidden="true" />
          <p className="pidx" aria-hidden="true">
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>/ {total}</span>
          </p>
          <h3>{p.name}</h3>
          <div className="pbody">
            <p>{p.description}</p>
            <ul className="chips" aria-label={`${p.name} tech stack`}>
              {p.stack.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
