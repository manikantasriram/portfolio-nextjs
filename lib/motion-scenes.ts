/** GSAP scenes. Loaded on demand from motion.tsx so GSAP stays out of the first-load bundle. */
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

// one-shot scenes

const enterScenes = {
  /** Section header: the rule draws in, the title rises letter by letter. */
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

  /** Project row: rule, index, title, then the stack icons. */
  project(row: HTMLElement) {
    const title = row.querySelector<HTMLElement>("h3");
    gsap.set($$(".pidx, .pbody > p, .tech", row), { opacity: 0 });
    if (title) gsap.set(title, { opacity: 0 });
    gsap.set(row, { opacity: 1 });

    gsap
      .timeline({ defaults: { ease: EASE_OUT } })
      .fromTo($$(".rule", row), { scaleX: 0 }, { scaleX: 1, duration: 1.4 }, 0)
      .fromTo($$(".pidx", row), { x: -12 }, { opacity: 1, x: 0, duration: 0.7 }, 0.1)
      .fromTo($$(".pbody > p", row), { y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
      .fromTo(
        $$(".tech", row),
        { y: 10, scale: 0.9 },
        // clear these so the CSS hover works afterwards
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.045, clearProps: "opacity,transform" },
        0.55,
      );
    if (title) riseLines(title, { delay: 0.15 });
  },

  /** Portrait reveal plus a little parallax. */
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

  email(mask: HTMLElement) {
    const email = mask.querySelector(".big");
    gsap.set(mask, { opacity: 1 });
    if (email) gsap.fromTo(email, { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: EASE_OUT });
  },
};

export function enter(scene: keyof typeof enterScenes, el: HTMLElement) {
  enterScenes[scene](el);
}

// scroll-linked scenes

const scrubScenes = {
  /** Draws the branch lines with the scroll and lights up nodes as they pass. */
  graph(list: HTMLElement) {
    // data-top / data-bottom are kept in sync by experience.tsx
    $$<SVGPathElement>(".g-line", list).forEach((path) => {
      gsap.fromTo(
        path,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          autoRound: false, // path is 1 unit long, rounding would snap it
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

  /** Words go from muted to full ink as you scroll. */
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

/**
 * Photo reel. On wide screens it pins and vertical scroll moves the track sideways, with a counter,
 * progress bar and a bit of parallax/tilt per frame. Phones keep the native swipe strip.
 */
function photos(reel: HTMLElement) {
  if (!window.matchMedia("(min-width: 901px)").matches) return;
  const track = reel.querySelector<HTMLElement>(".reel-track");
  if (!track) return;
  const now = reel.querySelector<HTMLElement>(".reel-now");
  const bar = reel.querySelector<HTMLElement>(".reel-bar i");
  reel.classList.add("pinned");

  const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
  const visible = () => $$(".shot:not([data-hidden])", track);

  const travel = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: reel,
      // centre between the 64px nav and the 28px status bar
      start: "center center+=18",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
        if (now) {
          const count = visible().length;
          now.textContent = String(Math.min(count, Math.round(self.progress * (count - 1)) + 1)).padStart(2, "0");
        }
      },
    },
  });

  // The filter changed the reel's length. ScrollTrigger ignores synthetic resize events, so refresh
  // here and jump back to the start of the pin if we're inside it.
  const pin = travel.scrollTrigger;
  reel.addEventListener("reel:change", () => {
    if (!pin) return;
    const inside = window.scrollY >= pin.start - 2;
    ScrollTrigger.refresh();
    if (inside) window.scrollTo({ top: pin.start, behavior: "instant" });
  });

  // The browser can't scroll a pinned, transformed track to the focused photo, so move the page there.
  track.addEventListener("focusin", (e) => {
    const target = e.target as HTMLElement;
    // keyboard only: a mouse click also focuses the link, and moving the page mid-click cancels it
    if (!target.matches(":focus-visible")) return;
    const item = target.closest<HTMLElement>(".shot, .reel-end");
    const total = distance();
    if (!pin || !item || total <= 0) return;
    const left = item.getBoundingClientRect().left - track.getBoundingClientRect().left;
    const x = Math.min(total, Math.max(0, left + item.offsetWidth / 2 - document.documentElement.clientWidth / 2));
    const progress = x / total;
    window.scrollTo({ top: pin.start + progress * (pin.end - pin.start), behavior: "instant" });
    travel.progress(progress); // don't wait for the scrub
  });

  $$(".shot", track).forEach((shot) => {
    const frame = shot.querySelector<HTMLElement>(".frame");
    const img = frame?.querySelector<HTMLImageElement>(":scope > img");
    if (!frame || !img) return;
    gsap.fromTo(
      img,
      { xPercent: -6, scale: 1.14 },
      {
        xPercent: 6,
        scale: 1.14,
        ease: "none",
        scrollTrigger: { trigger: shot, containerAnimation: travel, start: "left right", end: "right left", scrub: true },
      },
    );
    gsap.fromTo(
      frame,
      { rotate: 2.5, y: 24 },
      {
        rotate: 0,
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: shot, containerAnimation: travel, start: "left right", end: "left 55%", scrub: true },
      },
    );
  });
}

export function attach(scene: keyof typeof scrubScenes | "photos", el: HTMLElement) {
  if (scene === "photos") return photos(el);
  scrubScenes[scene](el);
}

// page-wide extras

/** Hero name and dot grid scroll a little slower than the page. */
function heroParallax() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const leave = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to($$(".hero-top", hero), { yPercent: 7, ease: "none", scrollTrigger: leave });
  gsap.to($$(".hero-grid", hero), { yPercent: 12, ease: "none", scrollTrigger: leave });
}

/** Magnetic buttons (fine pointers only). Returns a cleanup. */
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

  return () => off.forEach((fn) => fn());
}

/**
 * Registers the plugins, starts the page-wide effects and returns a teardown.
 * ScrollTrigger resets the scroll while measuring, which cancels a smooth scroll, so motion.tsx only
 * calls this when the page is idle, and later refreshes use the safe variant.
 */
export function start(): () => void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  heroParallax();
  const stopInteractions = interactions();

  // Lazy sections and web fonts both shift the layout, so re-measure when they settle.
  let timer = 0;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(true), 200);
  };
  document.addEventListener("contentvisibilityautostatechange", refresh, true);
  if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(refresh);

  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("contentvisibilityautostatechange", refresh, true);
    stopInteractions();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.getChildren(true, true, true).forEach((tween) => tween.kill());
    gsap.set("[data-scene], [data-scene] *, .hero-top, .hero-grid, [data-magnetic]", { clearProps: "all" });
    $$(".reel.pinned").forEach((reel) => reel.classList.remove("pinned"));
  };
}
