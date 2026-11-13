"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { experience, type CommitType, type Role } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Filter = "all" | CommitType;
const filters: Filter[] = ["all", "feat", "perf", "fix"];
const allCommits = experience.flatMap((r) => r.commits);
const count = (f: Filter) =>
  f === "all" ? allCommits.length : allCommits.filter((c) => c.type === f).length;

/** Where the scroll "playhead" sits in the viewport while the graph draws. */
const PLAYHEAD = "62%";

interface Geometry {
  width: number;
  height: number;
  /** Dashed HEAD → first commit segment. */
  pending: string;
  /** The main branch, top to bottom. */
  main: { d: string; top: number; bottom: number };
  /** Side branches that fork from main and merge back into it. */
  branches: { d: string; top: number; bottom: number }[];
}

/** Reads node positions from the DOM and turns them into SVG paths for the commit graph. */
function measure(list: HTMLOListElement): Geometry | null {
  const base = list.getBoundingClientRect();
  const nodes = [...list.querySelectorAll<HTMLElement>(".node")].map((el) => ({
    // offset* ignores transforms, so an animating node still reports its resting position
    x: el.offsetLeft + el.offsetWidth / 2,
    y: el.offsetTop + (el.offsetParent as HTMLElement).offsetTop + el.offsetHeight / 2,
    lane: Number(el.dataset.lane),
  }));
  if (nodes.length < 3) return null;

  const [head, ...rest] = nodes;
  const root = rest[rest.length - 1];
  const firstMain = rest.find((n) => n.lane === 0) ?? root;
  const x0 = head.x;

  const branches = nodes
    .map((node, i) => ({ node, next: nodes[i + 1] }))
    .filter(({ node }) => node.lane === 1)
    .map(({ node, next }) => {
      const x1 = node.x;
      const merge = node.y - 64; // rejoins main inside the role above it
      const fork = (next ?? root).y - 30; // leaves main just above the older commit
      const m1 = (merge + node.y) / 2;
      return {
        top: merge,
        bottom: fork,
        d: [
          `M ${x0} ${merge}`,
          `C ${x0} ${m1}, ${x1} ${m1 - 8}, ${x1} ${node.y}`,
          `L ${x1} ${fork - 46}`,
          `C ${x1} ${fork - 20}, ${x0} ${fork - 26}, ${x0} ${fork}`,
        ].join(" "),
      };
    });

  return {
    width: base.width,
    height: base.height,
    pending: `M ${x0} ${head.y + 9} L ${x0} ${firstMain.y - 9}`,
    main: { d: `M ${x0} ${firstMain.y} L ${x0} ${root.y}`, top: firstMain.y, bottom: root.y },
    branches,
  };
}

function RoleEntry({ role, filter }: { role: Role; filter: Filter }) {
  const lane = role.ref.tone === "branch" ? 1 : 0;
  return (
    <li className={`g-row lane-${lane}`}>
      <span className="node" data-lane={lane} aria-hidden="true" />
      <div className="g-meta" data-reveal="">
        <span className={`ref ${lane ? "branch" : ""}`}>{role.ref.label}</span>
        <h3>{role.company}</h3>
        <h4>{role.title}</h4>
        <p className="meta">
          <time>{role.dates}</time>
          <span aria-hidden="true"> · </span>
          {role.link ? (
            <a className="ext" href={role.link.href} target="_blank" rel="noopener noreferrer">
              {role.link.label}
            </a>
          ) : (
            role.location
          )}
        </p>
      </div>
      <ul className="cl" aria-label={`${role.company} highlights`} data-stagger="">
        {role.commits.map((c) => (
          <li
            key={c.hash}
            className="cmt"
            data-item=""
            data-dim={filter !== "all" && filter !== c.type}
          >
            <code className="h" aria-hidden="true">
              {c.hash}
            </code>
            <span className={`ty ${c.type}`} aria-hidden="true">
              {c.type}
            </span>
            <span className="msg">{c.text}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Experience as a `git log --graph`. The graph is a real one: `main` runs top to bottom and the
 * freelance work forks off into its own lane, then merges back. Lines draw as you scroll.
 */
export function ExperienceGraph() {
  const [filter, setFilter] = useState<Filter>("all");
  const [geo, setGeo] = useState<Geometry | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => setGeo(measure(list));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!geo || !list) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const draw = (path: Element | null, top: number, bottom: number) => {
          if (!path) return;
          gsap.fromTo(
            path,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              autoRound: false, // the path is 1 unit long, so whole-pixel rounding would snap it
              immediateRender: true,
              scrollTrigger: {
                trigger: list,
                start: `top+=${top} ${PLAYHEAD}`,
                end: `top+=${bottom} ${PLAYHEAD}`,
                scrub: 0.5,
              },
            },
          );
        };

        draw(list.querySelector(".g-main"), geo.main.top, geo.main.bottom);
        list
          .querySelectorAll(".g-branch")
          .forEach((path, i) => draw(path, geo.branches[i].top, geo.branches[i].bottom));

        // Each commit node lights up as the playhead passes it.
        list.querySelectorAll<HTMLElement>(".node").forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.6,
              ease: "back.out(2.4)",
              scrollTrigger: { trigger: node, start: "top 90%", once: true },
            },
          );
          ScrollTrigger.create({
            trigger: node,
            start: `center ${PLAYHEAD}`,
            onEnter: () => node.classList.add("on"),
            onLeaveBack: () => node.classList.remove("on"),
          });
        });
      });

      return () => mm.revert();
    },
    { dependencies: [geo], scope: listRef, revertOnUpdate: true },
  );

  return (
    <>
      <div className="gfilter" role="group" aria-label="Highlight commits by type" data-reveal="">
        <span className="gcmd" aria-hidden="true">
          <b>$</b> git log --grep
        </span>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`gf ${f}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
            <span aria-hidden="true">{count(f)}</span>
            <span className="sr-only">
              , {count(f)} {count(f) === 1 ? "commit" : "commits"}
            </span>
          </button>
        ))}
      </div>

      <ol ref={listRef} className="graph">
        {geo && (
          <svg
            className="g-svg"
            width={geo.width}
            height={geo.height}
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            aria-hidden="true"
            focusable="false"
          >
            <path className="g-pending" d={geo.pending} />
            <path className="g-track" d={geo.main.d} />
            {geo.branches.map((b, i) => (
              <path key={`t${i}`} className="g-track branch" d={b.d} />
            ))}
            <path className="g-main" d={geo.main.d} pathLength={1} />
            {geo.branches.map((b, i) => (
              <path key={`b${i}`} className="g-branch" d={b.d} pathLength={1} />
            ))}
          </svg>
        )}

        <li className="g-row head">
          <span className="node ghost" data-lane={0} aria-hidden="true" />
          <div className="g-meta" data-reveal="">
            <span className="ref">HEAD → next</span>
            <p className="nx">
              Next commit unwritten.{" "}
              <a className="ext" href="#contact">
                Start it in contact.sh
              </a>
            </p>
          </div>
        </li>

        {experience.map((role) => (
          <RoleEntry key={role.company} role={role} filter={filter} />
        ))}

        <li className="g-row root">
          <span className="node" data-lane={0} aria-hidden="true" />
          <p className="g-init" data-reveal="">
            init ·{" "}
            <a className="ext" href="#education">
              education.md
            </a>
          </p>
        </li>
      </ol>
    </>
  );
}
