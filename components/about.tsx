import Image from "next/image";
import { Section } from "@/components/section";
import { about, approach } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Background and development philosophy.
 * Employment detail is in Experience, tools are in Skills.
 */
export function About() {
  return (
    <Section id="about" comment="// background and development philosophy">
      <div className="about">
        <div className="about-text">
          <p className="tenure" data-reveal="">
            <b aria-hidden="true">#</b> {about.tenure}
          </p>
          <p className="statement" data-scrub-words="">
            {about.background}
          </p>
        </div>

        <figure className="portrait" data-portrait="">
          <figcaption aria-hidden="true">
            <span>portrait.webp</span>
            <span>480 × 480</span>
          </figcaption>
          <div className="portrait-img">
            <Image
              src={site.photo}
              width={480}
              height={480}
              sizes="(max-width: 720px) 60vw, 300px"
              loading="eager"
              alt="Manikanta Sriram, full stack developer in Hyderabad, in a navy blazer"
            />
          </div>
        </figure>
      </div>

      {/* about.md continues with a second-level heading, the way a markdown file would */}
      <h3 className="subhead" data-reveal="">
        <b aria-hidden="true">##</b> How I build
      </h3>
      <ol className="appr" data-stagger="">
        {approach.map((a, i) => (
          <li key={a.title} data-item="">
            <span className="num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4>{a.title}</h4>
            <p>{a.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
