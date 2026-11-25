import { Download } from "lucide-react";
import { Suspense } from "react";
import { About } from "@/components/about";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { Education } from "@/components/education";
import { ExperienceGraph } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Motion } from "@/components/motion";
import { Nav } from "@/components/nav";
import { PhotoSheet } from "@/components/photos";
import { ProjectList } from "@/components/projects";
import { Section } from "@/components/section";
import { SkillsGrid } from "@/components/skills";
import { StatusBar } from "@/components/status-bar";
import { contact } from "@/lib/content";
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
          {/* separate Suspense boundary so it hydrates as its own task */}
          <Suspense>
            <ExperienceGraph />
          </Suspense>
        </Section>

        <Section id="projects" comment="// full stack projects, both live">
          <ProjectList />
        </Section>

        <Section id="skills" comment="// tools I reach for">
          <SkillsGrid />
        </Section>

        <Section id="education" comment="// git checkout init, where it started">
          <Education />
        </Section>

        <Section id="photos" comment="// what I see when I step away from the screen">
          <PhotoSheet />
        </Section>

        <Marquee />

        <Section id="contact" comment={`// ${contact.availability}`}>
          <div className="contact">
            <p className="kick" data-reveal="" aria-hidden="true">
              <b>$</b>mail
            </p>
            {/* headline instead of the giant address: the form is the main action now */}
            <div className="big-mask" data-scene="email">
              <h3 className="ctitle">Let&apos;s build something together.</h3>
            </div>
            <div data-reveal="">
              <ContactForm />
              {/* the address and its copy button are one group, so they never wrap apart */}
              <p className="cmail">
                <span>Prefer email?</span>
                <span className="cmail-addr">
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <CopyEmail email={site.email} compact />
                </span>
              </p>
            </div>
            <div className="cta" data-stagger="">
              <a
                className="btn main"
                href={site.resume}
                download={site.resumeFile}
                data-item=""
                data-magnetic=""
              >
                {/* very small phones show "Resume"; the full label stays for screen readers */}
                <span className="lbl-long">Download resume</span>
                <span className="lbl-short" aria-hidden="true">
                  Resume
                </span>
                <Download className="i-down" strokeWidth={2} aria-hidden="true" />
              </a>
              {/* icon-only: the visible name lives in the tooltip, the accessible name in sr-only text */}
              <a
                className="btn icon"
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                data-item=""
                data-magnetic=""
                data-tip="LinkedIn"
              >
                <LinkedInIcon />
                <span className="sr-only">LinkedIn (opens in a new tab)</span>
              </a>
              <a
                className="btn icon"
                href={site.github}
                target="_blank"
                rel="noopener noreferrer me"
                data-item=""
                data-magnetic=""
                data-tip="GitHub"
              >
                <GitHubIcon />
                <span className="sr-only">GitHub (opens in a new tab)</span>
              </a>
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
