import { sectionMeta, type SectionId } from "@/lib/site";

interface SectionProps {
  id: SectionId;
  /** Terminal-style comment under the heading, e.g. "// how I build". */
  comment?: string;
  children: React.ReactNode;
}

/**
 * A page section, opened by a git-diff style hunk header:
 *   @@ 02 experience.log @@ ────────────
 * The number, file name and title come from the section map in lib/site.ts.
 */
export function Section({ id, comment, children }: SectionProps) {
  const meta = sectionMeta(id);
  const headingId = `${id}-title`;
  return (
    <section id={id} className="sec" aria-labelledby={headingId}>
      <div className="wrap">
        <header className="sh" data-scene="header">
          <p className="hunk" aria-hidden="true">
            <b>@@</b>
            <span>{meta.number}</span>
            <span className="file">{meta.file}</span>
            <b>@@</b>
            <i />
          </p>
          <h2 id={headingId}>{meta.label}</h2>
          {comment && <p className="cm">{comment}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
