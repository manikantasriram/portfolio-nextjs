import { Section } from "@/components/section";
import { about, approach } from "@/lib/content";
import { site } from "@/lib/site";

export function About() {
  return (
    <Section id="about" comment="// background and development philosophy">
      <div className="about">
        <div className="about-text">
          <p className="tenure" data-reveal="">
            <b aria-hidden="true">#</b> {about.tenure}
          </p>
          {/* one span per word for the scroll highlight */}
          <p className="statement" data-scene="statement">
            {about.background.split(" ").map((word, i) => (
              <span key={i} className="w">
                {word}{" "}
              </span>
            ))}
          </p>
        </div>

        <figure className="portrait" data-scene="portrait">
          <figcaption aria-hidden="true">
            <span>portrait.webp</span>
            <span>480 × 480</span>
          </figcaption>
          <div className="portrait-img">
            {/* no image optimiser in a static export, so the srcset is written by hand */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.photo}
              srcSet="/images/manikanta-sriram-240.webp 240w, /images/manikanta-sriram-480.webp 480w"
              width={480}
              height={480}
              sizes="(max-width: 720px) 60vw, 300px"
              loading="lazy"
              decoding="async"
              alt="Manikanta Sriram, full stack developer in Hyderabad, in a navy blazer"
            />
          </div>
        </figure>
      </div>

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
