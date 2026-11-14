import { ArrowDownRight, Download } from "lucide-react";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { hero } from "@/lib/content";
import { site } from "@/lib/site";

/** One token of the main.py listing: [text, syntax class]. */
type Token = [text: string, cls?: string];

/** main.py: a short, readable profile. Every value matches the rest of the page. */
const mainPy: Token[][] = [
  [["# products, end to end", "cc"]],
  [["developer = {"]],
  [["    "], ['"name"', "s"], [": "], ['"Manikanta Sriram"', "s"], [","]],
  [["    "], ['"role"', "s"], [": "], ['"Full Stack Developer"', "s"], [","]],
  [["    "], ['"frontend"', "s"], [": "], ["["], ['"React"', "s"], [", "], ['"TypeScript"', "s"], ["]"], [","]],
  [["    "], ['"backend"', "s"], [": "], ["["], ['"FastAPI"', "s"], [", "], ['"PostgreSQL"', "s"], ["]"], [","]],
  [["    "], ['"location"', "s"], [": "], ['"Hyderabad, India"', "s"], [","]],
  [["    "], ['"open_to_work"', "s"], [": "], ["True", "n"], [","]],
  [["}"]],
];

/** Letters carry their index so CSS can stagger them (`--i`). */
const Letters = ({ text, from }: { text: string; from: number }) =>
  text.split("").map((ch, i) => (
    <b key={i} style={{ "--i": from + i } as React.CSSProperties}>
      {ch}
    </b>
  ));

/**
 * The hero is server-rendered and its entrance is pure CSS (see "hero entrance" in globals.css),
 * so the name paints with the first frame instead of waiting for JavaScript.
 */
export function Hero() {
  const [first, marked, last] = hero.tagline;

  return (
    <header className="hero">
      <HeroBackdrop />
      <div className="wrap">
        <p className="kick" aria-hidden="true">
          <b>$</b>
          <span className="cmd">whoami</span>
          <span className="caret" />
        </p>

        <div className="hero-top">
          <h1 className="name" aria-label={site.name}>
            <span>
              <Letters text={site.firstName} from={0} />
            </span>{" "}
            <span>
              <Letters text={site.lastName} from={site.firstName.length} />
            </span>
          </h1>
          <p className="role">
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
            <p className="lead">
              <span>
                {first} <span className="mark">{marked}</span> {last}
              </span>
            </p>
            <div className="cta">
              <a className="btn main" href={site.resume} download={site.resumeFile} data-magnetic="">
                Download resume <Download className="i-down" strokeWidth={2} aria-hidden="true" />
              </a>
              <a className="btn" href="#contact" data-magnetic="">
                Get in touch <ArrowDownRight className="i-out" strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="editor">
            <div className="bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span className="tab on">main.py</span>
            </div>
            <pre className="code" aria-hidden="true">
              {mainPy.map((tokens, i) => (
                <span key={i} className="l" style={{ "--i": i } as React.CSSProperties}>
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
            <p className="out" aria-hidden="true">
              <span>
                <b className="k">$</b> python main.py
              </span>
              <span className="ok">✓ ready to ship · open_to_work=True</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
