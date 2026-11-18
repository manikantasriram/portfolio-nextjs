import { sectionMeta, type SectionId } from "@/lib/site";

interface SectionProps {
  id: SectionId;
  /** Terminal-style comment under the heading, e.g. "// how I build". */
  comment?: string;
  children: React.ReactNode;
}

/** Section with a file-tab header; number, file name and title come from lib/site.ts. */
export function Section({ id, comment, children }: SectionProps) {
  const meta = sectionMeta(id);
  const headingId = `${id}-title`;
  return (
    <section id={id} className="sec" aria-labelledby={headingId}>
      <div className="wrap">
        <header className="sh" data-scene="header">
          <p className="hunk" aria-hidden="true">
            <b>{meta.number}</b>
            <span className="file">{meta.file}</span>
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
