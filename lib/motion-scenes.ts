/**
 * The GSAP scenes. This module is loaded on demand (see components/motion.tsx), so GSAP is
 * never part of the first-load JavaScript.
 *
 *   enter(scene, el)   one-shot animation as an element scrolls into view
 *   attach(scene, el)  animation that follows the scroll position (ScrollTrigger scrub)
 *   start()            page-wide extras: hero parallax, magnetic buttons, tilting orbs
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.defaults({ ease: "power3.out", duration: 0.9 });

const EASE_OUT = "expo.out";
/** Where the scroll "playhead" sits in the viewport while the commit graph draws. */
const PLAYHEAD = "62%";

const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/** Splits a heading into masked lines and slides them up, then restores the original markup. */
function riseLines(el: HTMLElement, { delay = 0, stagger = 0.09, duration = 1 } = {}) {
  gsap.set(el, { opacity: 1 });
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.lines,
        { yPercent: 110 },
        { yPercent: 0, duration, stagger, delay, ease: EASE_OUT, onComplete: () => self.revert() },
      ),
  });
}

/* ------------------------------------------------------- one-shot scenes */

const enterScenes = {
  /** 02 experience.log ──── the rule draws out, the title rises letter by letter. */
  header(header: HTMLElement) {
    const title = header.querySelector<HTMLElement>("h2");
    const comment = header.querySelector<HTMLElement>(".cm");

    gsap.fromTo($$(".hunk", header), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" });
    gsap.fromTo($$(".hunk i", header), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE_OUT });

    if (title) {
      gsap.set(title, { opacity: 1 });
      SplitText.create(title, {
        type: "words, chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.chars,
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 0.95,
              stagger: 0.028,
              delay: 0.1,
              ease: EASE_OUT,
              onComplete: () => self.revert(),
            },
          ),
      });
    }

    if (comment) {
      const steps = Math.min(48, comment.textContent?.length ?? 1);
      gsap.fromTo(
        comment,
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.75,
          delay: 0.5,
          ease: `steps(${steps})`,
          clearProps: "clipPath",
        },
      );
    }
  },

  /** A project row: the rule draws, the index slides in, the title rises, chips pop. */
  project(row: HTMLElement) {
    const title = row.querySelector<HTMLElement>("h3");
    gsap.set($$(".pidx, .pbody > p, .chip", row), { opacity: 0 });
    if (title) gsap.set(title, { opacity: 0 });
    gsap.set(row, { opacity: 1 });

    gsap
      .timeline({ defaults: { ease: EASE_OUT } })
      .fromTo($$(".rule", row), { scaleX: 0 }, { scaleX: 1, duration: 1.4 }, 0)
      .fromTo($$(".pidx", row), { x: -12 }, { opacity: 1, x: 0, duration: 0.7 }, 0.1)
      .fromTo($$(".pbody > p", row), { y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
      .fromTo(
        $$(".chip", row),
        { y: 10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.045 },
        0.55,
      );
    if (title) riseLines(title, { delay: 0.15 });
  },

  /** The portrait is unveiled top to bottom, and settles as it crosses the viewport. */
  portrait(portrait: HTMLElement) {
    gsap.fromTo(
      portrait,
      { opacity: 0, clipPath: "inset(0 0 100% 0)" },
      { opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: EASE_OUT, clearProps: "clipPath" },
    );
    gsap.fromTo(
      $$("img", portrait),
      { scale: 1.18 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: portrait, start: "top bottom", end: "center center", scrub: true },
      },
    );
  },

  /** The contact email rises out of a mask. */
  email(mask: HTMLElement) {
    const email = mask.querySelector(".big");
    gsap.set(mask, { opacity: 1 });
    if (email) gsap.fromTo(email, { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: EASE_OUT });
  },
};

export function enter(scene: keyof typeof enterScenes, el: HTMLElement) {
  enterScenes[scene](el);
}

/* ---------------------------------------------------- scroll-linked scenes */

const scrubScenes = {
  /** Branch lines draw themselves as the playhead moves down the log; nodes light up as it passes. */
  graph(list: HTMLElement) {
    // Each path carries its vertical extent (data-top / data-bottom), kept current by React.
    $$<SVGPathElement>(".g-line", list).forEach((path) => {
      gsap.fromTo(
        path,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          autoRound: false, // the path is 1 unit long, so whole-pixel rounding would snap it
          scrollTrigger: {
            trigger: list,
            start: () => `top+=${path.dataset.top} ${PLAYHEAD}`,
            end: () => `top+=${path.dataset.bottom} ${PLAYHEAD}`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    $$(".node", list).forEach((node) => {
      ScrollTrigger.create({
        trigger: node,
        start: `center ${PLAYHEAD}`,
        onEnter: () => node.classList.add("on"),
        onLeaveBack: () => node.classList.remove("on"),
      });
    });
  },

  /**
   * The background statement "reads itself": words go from muted to full ink as you scroll.
   * Each word is a <span class="w"> rendered on the server; CSS does the colour transition.
   */
  statement(statement: HTMLElement) {
    const words = $$(".w", statement);
    let lit = 0;
    ScrollTrigger.create({
      trigger: statement,
      start: "top 82%",
      end: "bottom 56%",
      onUpdate: (self) => {
        const next = Math.round(self.progress * words.length);
        if (next === lit) return;
        const [from, to] = next > lit ? [lit, next] : [next, lit];
        for (let i = from; i < to; i++) words[i].classList.toggle("on", next > lit);
        lit = next;
      },
    });
  },
};

export function attach(scene: keyof typeof scrubScenes, el: HTMLElement) {
  scrubScenes[scene](el);
}

/* ------------------------------------------------------- page-wide extras */

/** Leaving the hero: the name and the dot grid drift a little slower than the page. */
function heroParallax() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const leave = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to($$(".hero-top", hero), { yPercent: 7, ease: "none", scrollTrigger: leave });
  gsap.to($$(".hero-grid", hero), { yPercent: 12, ease: "none", scrollTrigger: leave });
}

/**
 * Skills hover, pointer devices only. Only transform and opacity are animated, so every frame
 * stays on the compositor:
 *   - the orb lifts with a soft spring and tilts toward the pointer
 *   - the logo gives a small wobble and a thin ring ripples out once
 *   - the other tools in the group fade back, and the group's key lights up
 * Returns a cleanup function that restores the original markup and styles.
 */
function skillHover() {
  const off: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) => {
    el.addEventListener(type, fn);
    off.push(() => el.removeEventListener(type, fn));
  };
  const root = document.documentElement;
  root.setAttribute("data-fx", "");
  const touched: HTMLElement[] = [];
  const rings: HTMLElement[] = [];

  $$(".sg").forEach((group) => {
    const list = group.querySelector<HTMLElement>(".tiles");
    const tiles = $$("[data-tilt]", group);
    if (!list || !tiles.length) return;

    tiles.forEach((tile) => {
      const orb = tile.querySelector<HTMLElement>(".orb");
      const mark = orb?.firstElementChild as HTMLElement | null;
      if (!orb || !mark) return;
      const ring = document.createElement("i");
      ring.className = "ring";
      ring.setAttribute("aria-hidden", "true");
      orb.append(ring);
      rings.push(ring);
      touched.push(orb, mark, tile);
      gsap.set(mark, { z: 14 });

      const rx = gsap.quickTo(orb, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(orb, "rotationY", { duration: 0.6, ease: "power3.out" });

      listen(tile, "pointerenter", () => {
        group.classList.add("on");
        gsap.to(tiles, { opacity: (_, t) => (t === tile ? 1 : 0.45), duration: 0.35, overwrite: "auto" });
        gsap.to(orb, { y: -6, scale: 1.06, duration: 0.5, ease: "back.out(2.6)", overwrite: "auto" });
        gsap.fromTo(
          mark,
          { rotation: 0 },
          { keyframes: { rotation: [0, -10, 7, 0] }, duration: 0.6, ease: "power1.out", overwrite: "auto" },
        );
        gsap.fromTo(ring, { scale: 0.92, opacity: 0.55 }, { scale: 1.5, opacity: 0, duration: 0.8, ease: "power2.out" });
      });
      listen(tile, "pointermove", (e) => {
        const r = tile.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 26);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 26);
      });
      listen(tile, "pointerleave", () => {
        rx(0);
        ry(0);
        gsap.to(orb, { y: 0, scale: 1, duration: 0.9, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
      });
    });

    listen(list, "pointerleave", () => {
      group.classList.remove("on");
      gsap.to(tiles, { opacity: 1, duration: 0.4, overwrite: "auto", clearProps: "opacity" });
    });
  });

  return () => {
    off.forEach((fn) => fn());
    gsap.killTweensOf([...touched, ...rings]);
    gsap.set(touched, { clearProps: "all" });
    rings.forEach((ring) => ring.parentNode?.removeChild(ring));
    $$(".sg.on").forEach((g) => g.classList.remove("on"));
    root.removeAttribute("data-fx");
  };
}

/** Pointer-only polish: magnetic buttons and skill hover. Returns a cleanup function. */
function interactions() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const off: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) => {
    el.addEventListener(type, fn);
    off.push(() => el.removeEventListener(type, fn));
  };

  // Buttons lean toward the pointer and spring back.
  $$("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    listen(el, "pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    });
    listen(el, "pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });

  off.push(skillHover());

  return () => off.forEach((fn) => fn());
}

/**
 * Registers the plugins, starts the page-wide extras and returns a function that tears every
 * scene down again. Must be called before enter() or attach().
 *
 * ScrollTrigger measures the page by briefly resetting the scroll position, which would cancel a
 * native smooth scroll. So this is only called while the page is not scrolling (see motion.tsx),
 * and later re-measurements use the "safe" refresh, which waits for scrolling to end.
 */
export function start(): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  heroParallax();
  const stopInteractions = interactions();

  // Sections below the fold are rendered progressively after load (lib/lazy-sections.ts), and
  // web fonts change text metrics. Re-measure the scroll positions when either happens.
  let timer = 0;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(true), 200);
  };
  document.addEventListener("contentvisibilityautostatechange", refresh, true);
  // Only needed if web fonts are still arriving; usually they loaded long before this runs.
  if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(refresh);

  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("contentvisibilityautostatechange", refresh, true);
    stopInteractions();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.getChildren(true, true, true).forEach((tween) => tween.kill());
    gsap.set("[data-scene], [data-scene] *, .hero-top, .hero-grid, [data-magnetic]", { clearProps: "all" });
  };
}
