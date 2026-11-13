import { ArrowDownRight, Download } from "lucide-react";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { HeroTerminal } from "@/components/hero-terminal";
import { hero } from "@/lib/content";
import { sections, site } from "@/lib/site";

/** One token of the main.py listing: [text, syntax class]. */
type Token = [text: string, cls?: string];

/**
 * main.py is the page itself, written as a program: it imports the sections and renders them
 * in order. It holds no professional details; those live in each section.
 */
const mainPy: Token[][] = [
  [["# main.py: this page, as a program", "cc"]],
  [["from", "k"], [" portfolio "], ["import", "k"], [" sections"]],
  [],
  [["def", "k"], [" "], ["main", "p"], ["() -> "], ["None", "n"], [":"]],
  [["    "], ["for", "k"], [" section "], ["in", "k"], [" sections:"]],
  [["        section."], ["render", "p"], ["()  "], ["# scroll to run", "cc"]],
  [],
  [["if", "k"], [" __name__ == "], ['"__main__"', "s"], [":"]],
  [["    "], ["main", "p"], ["()"]],
];

const Letters = ({ text }: { text: string }) =>
  text.split("").map((ch, i) => <b key={i}>{ch}</b>);

export function Hero() {
  const [first, marked, last] = hero.tagline;

  return (
    <header className="hero">
      <HeroBackdrop />
      <div className="wrap">
        <p className="kick" data-hero="kick" aria-hidden="true">
          <b>$</b>
          <span className="cmd">whoami</span>
          <span className="caret" />
        </p>

        <div className="hero-top">
          <h1 className="name" data-hero="name" aria-label={site.name}>
            <span>
              <Letters text={site.firstName} />
            </span>{" "}
            <span>
              <Letters text={site.lastName} />
            </span>
          </h1>
          <p className="role" data-hero="role">
            <span>
              <b aria-hidden="true">{"//"}</b> {hero.role}
            </span>
            <span>
              <b aria-hidden="true">{"//"}</b> {hero.location}
            </span>
          </p>
        </div>

        <div className="hgrid">
          <div>
            <p className="lead" data-hero="lead">
              {first} <span className="mark">{marked}</span> {last}
            </p>
            <div className="cta" data-hero="cta">
              <a className="btn main" href={site.resume} download={site.resumeFile} data-magnetic="">
                Download resume <Download className="i-down" strokeWidth={2} aria-hidden="true" />
              </a>
              <a className="btn" href="#contact" data-magnetic="">
                Get in touch <ArrowDownRight className="i-out" strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="editor" data-hero="editor">
            <div className="bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span className="tab on">main.py</span>
              <span className="tab">zsh</span>
            </div>
            <pre className="code" aria-hidden="true">
              {mainPy.map((tokens, i) => (
                <span key={i} className="l">
                  {tokens.map(([text, cls], j) =>
                    cls ? (
                      <b key={j} className={cls}>
                        {text}
                      </b>
                    ) : (
                      text
                    ),
                  )}
                  {i === mainPy.length - 1 && <b className="caret" />}
                </span>
              ))}
            </pre>
            <HeroTerminal sectionCount={sections.length} />
          </div>
        </div>
      </div>
    </header>
  );
}
