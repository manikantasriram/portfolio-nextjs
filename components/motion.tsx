"use client";

import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

declare global {
  interface Window {
    /** Set once the animation layer has started (read by the bootstrap script in layout.tsx). */
    __motionReady?: boolean;
  }
}

const $$ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/** Splits `el` into masked lines and slides them up, then restores the original markup. */
function riseLines(el: HTMLElement, { delay = 0, stagger = 0.09, duration = 1 } = {}) {
  gsap.set(el, { autoAlpha: 1 });
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

/** Runs `enter` once, the first time `trigger` scrolls into view. */
function onceInView(trigger: Element, enter: () => void, start = "top 86%") {
  ScrollTrigger.create({ trigger, start, once: true, onEnter: enter });
}

/* ------------------------------------------------------------------ hero */

function heroIntro() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const q = gsap.utils.selector(hero);
  const steps = (el: Element | undefined) => `steps(${Math.max(1, el?.textContent?.length ?? 1)})`;

  gsap.set(q('[data-hero="name"], [data-hero="role"], [data-hero="cta"]'), { autoAlpha: 1 });

  const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
  tl.fromTo(q(".hero-grid"), { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 1.6, ease: "power2.out" }, 0)
    // $ whoami is typed, then the name answers it
    .fromTo(q(".kick"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "none" }, 0.05)
    .fromTo(
      q(".kick .cmd"),
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.42, ease: steps(q(".kick .cmd")[0]) },
      0.15,
    )
    .fromTo(q(".name b"), { yPercent: 118 }, { yPercent: 0, duration: 1.15, stagger: 0.034 }, 0.5)
    .fromTo(
      q(".role span"),
      { autoAlpha: 0, x: -14 },
      { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.12 },
      1.05,
    )
    .fromTo(
      q(".cta > *"),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.09 },
      1.35,
    )
    // the editor tilts up into place, then main.py writes itself and runs
    .fromTo(
      q(".editor"),
      { autoAlpha: 0, y: 44, rotateX: 7, transformPerspective: 1100, transformOrigin: "50% 100%" },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.3 },
      0.85,
    )
    .fromTo(
      q(".code .l"),
      { autoAlpha: 0, x: -12 },
      { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" },
      1.3,
    )
    .fromTo(
      q(".tl"),
      { autoAlpha: 0, x: -8 },
      { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.4, ease: "power3.out" },
      2.05,
    )
    .fromTo(
      q(".term-in, .term-hint"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" },
      2.8,
    );

  // Tagline: masked lines rise, then the underline is drawn across "Rock-solid APIs."
  const lead = q(".lead")[0] as HTMLElement | undefined;
  if (lead) {
    gsap.set(lead, { autoAlpha: 1 });
    SplitText.create(lead, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap
          .timeline({ delay: 1.0 })
          .fromTo(self.lines, { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1, ease: EASE_OUT })
          .fromTo(
            $$(".mark", lead),
            { backgroundSize: "0% 0.14em" },
            { backgroundSize: "100% 0.14em", duration: 0.9, ease: EASE_OUT },
            0.75,
          ),
    });
  }

  // Leaving the hero: the name and the dot grid drift a little slower than the page.
  const leave = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to(q(".hero-top"), { yPercent: 7, ease: "none", scrollTrigger: leave });
  gsap.to(q(".hero-grid"), { yPercent: 12, ease: "none", scrollTrigger: leave });
}

/* -------------------------------------------------------- section headers */

function sectionHeaders() {
  $$(".sh").forEach((header) => {
    const hunk = header.querySelector(".hunk");
    const rule = header.querySelector(".hunk i");
    const title = header.querySelector<HTMLElement>("h2");
    const comment = header.querySelector<HTMLElement>(".cm");

    onceInView(header, () => {
      // @@ 02 experience.log @@ ──── the rule draws out like a diff hunk opening
      gsap.fromTo(hunk, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none" });
      gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE_OUT });

      if (title) {
        gsap.set(title, { autoAlpha: 1 });
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
        const n = Math.min(48, comment.textContent?.length ?? 1);
        gsap.fromTo(
          comment,
          { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
          { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: 0.75, delay: 0.5, ease: `steps(${n})` },
        );
      }
    });
  });
}

/* --------------------------------------------------------- generic reveals */

function reveals() {
  // single elements
  $$("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 90%", once: true } },
    );
  });

  // groups: children marked data-item cascade in
  $$("[data-stagger]").forEach((group) => {
    const items = $$("[data-item]", group);
    if (!items.length) return;
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.055,
        scrollTrigger: { trigger: group, start: "top 86%", once: true },
      },
    );
  });

  // hairlines draw from the left
  $$("[data-line]").forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.3, ease: EASE_OUT, scrollTrigger: { trigger: line, start: "top 92%", once: true } },
    );
  });
}

/* ------------------------------------------------------------------ about */

function aboutScene() {
  // The background statement "reads itself": words sharpen as you scroll through it.
  const statement = document.querySelector<HTMLElement>("[data-scrub-words]");
  if (statement) {
    gsap.set(statement, { autoAlpha: 1 });
    const split = SplitText.create(statement, { type: "words", autoSplit: true });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 56%", scrub: 0.4 },
      },
    );
  }

  // The portrait is unveiled top to bottom, and settles as it crosses the viewport.
  const portrait = document.querySelector<HTMLElement>("[data-portrait]");
  if (portrait) {
    gsap.fromTo(
      portrait,
      { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
      {
        autoAlpha: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.4,
        ease: EASE_OUT,
        scrollTrigger: { trigger: portrait, start: "top 84%", once: true },
      },
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
  }
}

/* --------------------------------------------------------------- projects */

function projectsScene() {
  $$("[data-project]").forEach((row) => {
    const title = row.querySelector<HTMLElement>("h3");
    gsap.set(row, { autoAlpha: 1 });
    gsap.set($$(".pidx, .pbody > p, .chip", row), { autoAlpha: 0 });
    gsap.set($$(".rule", row), { scaleX: 0 });

    onceInView(
      row,
      () => {
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.to($$(".rule", row), { scaleX: 1, duration: 1.4 }, 0)
          .fromTo($$(".pidx", row), { x: -12 }, { autoAlpha: 1, x: 0, duration: 0.7 }, 0.1)
          .fromTo($$(".pbody > p", row), { y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35)
          .fromTo(
            $$(".chip", row),
            { y: 10, scale: 0.9 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.045 },
            0.55,
          );
        if (title) riseLines(title, { delay: 0.15 });
      },
      "top 84%",
    );
  });
}

/* ---------------------------------------------------------------- contact */

function contactScene() {
  const mask = document.querySelector<HTMLElement>("[data-email]");
  const email = mask?.querySelector(".big");
  if (!mask || !email) return;
  gsap.set(mask, { autoAlpha: 1 });
  gsap.fromTo(
    email,
    { yPercent: 115 },
    { yPercent: 0, duration: 1.2, ease: EASE_OUT, scrollTrigger: { trigger: mask, start: "top 90%", once: true } },
  );
}

/* ------------------------------------------------------------ interactions */

/** Pointer-only polish: magnetic buttons and tilting skill orbs. Returns a cleanup function. */
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

  // Skill orbs tilt in 3D under the pointer (CSS reads --rx / --ry).
  $$("[data-tilt]").forEach((tile) => {
    const orb = tile.querySelector<HTMLElement>(".orb");
    if (!orb) return;
    listen(tile, "pointermove", (e) => {
      const r = tile.getBoundingClientRect();
      orb.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 28}deg`);
      orb.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 28}deg`);
    });
    listen(tile, "pointerleave", () => {
      orb.style.setProperty("--ry", "0deg");
      orb.style.setProperty("--rx", "0deg");
    });
  });

  return () => off.forEach((fn) => fn());
}

/**
 * The animation director. Sections stay plain server-rendered HTML and opt in with data
 * attributes; this one component wires every GSAP timeline and ScrollTrigger on the page.
 * Nothing here runs under `prefers-reduced-motion: reduce`.
 */
export function Motion() {
  useGSAP(() => {
    window.__motionReady = true;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      heroIntro();
      sectionHeaders();
      reveals();
      aboutScene();
      projectsScene();
      contactScene();
      return interactions();
    });
  });

  return null;
}
