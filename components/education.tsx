import { PinIcon } from "@/components/pin-icon";
import { education } from "@/lib/content";

/** Education card. The "edu" scene raises the school name and counts the end year up from the start. */
export function Education() {
  return (
    <article className="edu" data-scene="edu">
      <p className="edu-when">
        <time>{education.dates}</time>
      </p>
      <div>
        <h3>{education.school}</h3>
        <h4>{education.degree}</h4>
        <p className="meta">
          <span className="loc">
            <PinIcon className="i-loc" />
            {education.location}
          </span>
        </p>
      </div>
    </article>
  );
}
