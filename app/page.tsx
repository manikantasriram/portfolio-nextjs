import { ArrowUpRight, Download } from "lucide-react";
import { Suspense } from "react";
import { About } from "@/components/about";
import { CopyEmail } from "@/components/copy-email";
import { ExperienceGraph } from "@/components/experience";
import { FitEmail } from "@/components/fit-email";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Motion } from "@/components/motion";
import { Nav } from "@/components/nav";
import { PhotoSheet } from "@/components/photos";
import { ProjectList } from "@/components/projects";
import { Section } from "@/components/section";
import { SkillsGrid } from "@/components/skills";
import { StatusBar } from "@/components/status-bar";
import { contact, education } from "@/lib/content";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <a className="skip" href="#top">
        Skip to content
      </a>
      <Nav />

      <main id="top" tabIndex={-1} className="outline-none">
        <Hero />
        <About />

        <Section id="experience" comment="// git log --graph, newest first">
          {/* its own Suspense boundary, so React hydrates this larger island as a separate task */}
          <Suspense>
            <ExperienceGraph />
          </Suspense>
        </Section>

        <Section id="projects" comment="// full stack projects, currently in progress">
          <ProjectList />
        </Section>

        <Section id="skills" comment="// tools I reach for">
          <SkillsGrid />
        </Section>

        <Section id="education">
          <article className="edu" data-stagger="">
            <p className="edu-when" data-item="">
              <time>{education.dates}</time>
            </p>
            <div data-item="">
              <h3>{education.school}</h3>
              <h4>{education.degree}</h4>
              <p className="meta">{education.location}</p>
            </div>
          </article>
        </Section>

        <Section id="photos" comment="// what I see when I step away from the screen">
          <PhotoSheet />
        </Section>

        <Section id="contact" comment={`// ${contact.availability}`}>
          <div className="contact">
            <p className="kick" data-reveal="" aria-hidden="true">
              <b>$</b>mail
            </p>
            <div className="big-mask" data-scene="email">
              <FitEmail email={site.email} />
            </div>
            <div className="cta" data-stagger="">
              <a
                className="btn main"
                href={site.resume}
                download={site.resumeFile}
                data-item=""
                data-magnetic=""
              >
                Download resume <Download className="i-down" strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                className="btn"
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                data-item=""
                data-magnetic=""
              >
                LinkedIn <ArrowUpRight className="i-out" strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                className="btn"
                href={site.github}
                target="_blank"
                rel="noopener noreferrer me"
                data-item=""
                data-magnetic=""
              >
                GitHub <ArrowUpRight className="i-out" strokeWidth={2} aria-hidden="true" />
              </a>
              <CopyEmail email={site.email} />
            </div>
          </div>
        </Section>
      </main>

      <Footer />
      <StatusBar />
      <Motion />
    </>
  );
}
