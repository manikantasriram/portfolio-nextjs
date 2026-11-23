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

    // depth: the header drifts a little slower than the rest of its section
    const section = header.closest("section");
    if (section) {
      gsap.fromTo(
        header,
        { y: 12 },
        {
          y: -12,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }

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

  /**
   * Project card: wipes up into view, the giant index rises, then the title, text and chips. The cards are
   * sticky, so while the next one slides up over this card, this one shrinks back and dims.
   */
  project(card: HTMLElement) {
    const title = card.querySelector<HTMLElement>("h3");
    gsap.set($$(".pbody > p, .tech", card), { opacity: 0 });
    if (title) gsap.set(title, { opacity: 0 });
    gsap.set(card, { opacity: 1 });

    gsap
      .timeline({ defaults: { ease: EASE_OUT } })
      // clip-path, not transform, so it never fights the scroll-linked scale below
      .fromTo(
        card,
        { clipPath: "inset(100% 0% 0% 0% round 24px)" },
        { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.1, clearProps: "clipPath" },
        0,
      )
      .fromTo($$(".pidx b", card), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1 }, 0.15)
      .fromTo($$(".pbody > p", card), { y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.4)
      .fromTo(
        $$(".tech", card),
        { y: 10, scale: 0.9 },
        // clear these so the CSS hover works afterwards
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, clearProps: "opacity,transform" },
        0.6,
      );
    if (title) riseLines(title, { delay: 0.2 });

    // only when the cards actually stack (CSS turns sticky off on narrow or short screens)
    const next = card.nextElementSibling as HTMLElement | null;
    if (next && getComputedStyle(card).position === "sticky") {
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top 92%", end: "top 30%", scrub: true },
      });
    }
  },

  /** Education: the school name rises, then the end year counts up from the start year. */
  edu(card: HTMLElement) {
    const time = card.querySelector<HTMLElement>("time");
    const title = card.querySelector<HTMLElement>("h3");
    const rest = $$("h4, .meta", card);
    gsap.set(card, { opacity: 1 });

    if (title) riseLines(title, { delay: 0.1 });
    gsap.fromTo(rest, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.35 });

    const years = time?.textContent?.match(/(\d{4})(\D+)(\d{4})/);
    if (time && years) {
      const [, from, sep, to] = years;
      const year = { v: Number(from) };
      gsap.fromTo(time, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.6 });
      gsap.to(year, {
        v: Number(to),
        duration: 1.6,
        delay: 0.3,
        ease: "power2.out",
        onUpdate: () => (time.textContent = `${from}${sep}${Math.round(year.v)}`),
      });
    }
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

  /**
   * Contact email: a quick, quiet rise out of its mask with a short fade (about half a second), then its
   * letters ripple up under the cursor (fine pointers only).
   */
  email(mask: HTMLElement) {
    const email = mask.querySelector<HTMLElement>(".big");
    gsap.set(mask, { opacity: 1 });
    if (!email) return;
    gsap.fromTo(
      email,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out", onComplete: () => ripple(email) },
    );
  },
};

/** Letters lift towards the cursor and settle when it leaves. Splits into spans because it's a link. */
function ripple(el: HTMLElement) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const split = SplitText.create(el, { type: "chars", tag: "span" });
  const chars = split.chars as HTMLElement[];
  const lifts = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.45, ease: "power3.out" }));
  const reach = 110;
  el.addEventListener("pointermove", (e) => {
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      lifts[i](-Math.max(0, 1 - d / reach) * 0.22 * r.height);
    });
  });
  el.addEventListener("pointerleave", () => lifts.forEach((lift) => lift(0)));
}

export function enter(scene: keyof typeof enterScenes, el: HTMLElement) {
  enterScenes[scene](el);
}

// scroll-linked scenes

const scrubScenes = {
  /**
   * Announcement ticker: loops on its own, the scroll speeds it up and flips its direction when you scroll
   * back up, then it eases back to its cruising speed. Pauses while off screen.
   */
  marquee(band: HTMLElement) {
    const track = band.querySelector<HTMLElement>(".mq-track");
    if (!track) return;
    const loop = gsap.fromTo(
      track,
      { xPercent: 0 },
      { xPercent: -50, duration: 40, ease: "none", repeat: -1, paused: true },
    );
    // start deep into the repeats so a negative timeScale has room to run backwards
    loop.totalTime(loop.duration() * 400);

    const speed = { v: 1 };
    const apply = () => loop.timeScale(speed.v);
    ScrollTrigger.create({
      trigger: band,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
      onUpdate: (self) => {
        gsap.killTweensOf(speed);
        speed.v = self.direction * (1 + Math.min(5, Math.abs(self.getVelocity()) / 400));
        apply();
        gsap.to(speed, { v: self.direction, duration: 1.4, ease: "power2.out", onUpdate: apply });
      },
    });
  },

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

  // This pin is created after the page-wide triggers further down the page, so put every trigger back
  // in page order; otherwise the ones below would be measured without the pin's extra scroll length.
  ScrollTrigger.sort();

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

/**
 * Hero exit, tied to the scroll: the name's letters slide out through their masks (alternating up and
 * down, from the middle outwards), the code card tips back in 3D, the tagline drifts up and the dot grid
 * lags behind. All of it reverses when you scroll back up.
 */
function heroExit() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const leave = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };

  // depth layers: the dot grid lags furthest behind, the name a little, so they separate as you scroll
  gsap.to($$(".hero-grid", hero), { yPercent: 22, ease: "none", scrollTrigger: leave });
  gsap.to($$(".hero-top", hero), { yPercent: 12, ease: "none", scrollTrigger: leave });

  // letters leave in the first ~60% of the hero so the name is gone before it reaches the nav
  const letters = $$(".name b", hero);
  gsap.to(letters, {
    yPercent: (i) => (i % 2 ? 115 : -115),
    rotation: (i) => (i % 2 ? 8 : -8),
    ease: "none",
    stagger: { each: 0.03, from: "center" },
    scrollTrigger: { ...leave, end: "60% top" },
  });

  // perspective is set once (tweening it from 0 would distort the tilt), only the tilt is scrubbed
  const editor = $$(".editor", hero);
  gsap.set(editor, { transformPerspective: 1100, transformOrigin: "50% 0%" });
  gsap.to(editor, {
    rotationX: 24,
    y: 60,
    scale: 0.92,
    opacity: 0.35,
    ease: "none",
    scrollTrigger: leave,
  });
  gsap.to($$(".lead, .hero .cta", hero), {
    y: -40,
    opacity: 0.2,
    ease: "none",
    stagger: 0.05,
    scrollTrigger: { ...leave, end: "70% top" },
  });
}

/** Section titles lean with the scroll speed and spring back upright when you stop. */
function velocitySkew() {
  const titles = $$(".sh h2");
  if (!titles.length) return;
  gsap.set(titles, { transformOrigin: "0% 50%", force3D: true });
  const skewTo = gsap.quickSetter(titles, "skewY", "deg");
  const clamp = gsap.utils.clamp(-7, 7);
  const lean = { skew: 0 };

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -320);
      if (Math.abs(skew) <= Math.abs(lean.skew)) return;
      lean.skew = skew;
      gsap.to(lean, {
        skew: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => skewTo(lean.skew),
      });
    },
  });
}

/** Magnetic buttons and the project-card spotlight (fine pointers only). Returns a cleanup. */
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

  // hero parallax: each layer follows the cursor by its own depth (negative = opposite, i.e. far back);
  // these use x / y / rotationY, separate from the scroll-linked yPercent / rotationX, so both combine
  const hero = document.querySelector<HTMLElement>(".hero");
  if (hero) {
    const layers = [
      { sel: ".hero-grid", x: -26, y: -18, turn: 0 },
      { sel: ".hero-top", x: 12, y: 6, turn: 0 },
      { sel: ".editor", x: 24, y: 16, turn: 5 },
    ].flatMap((layer) =>
      $$(layer.sel, hero).map((el) => ({
        ...layer,
        xTo: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
        yTo: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        turnTo: gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" }),
      })),
    );
    const move = (nx: number, ny: number) =>
      layers.forEach((l) => {
        l.xTo(nx * l.x);
        l.yTo(ny * l.y);
        if (l.turn) l.turnTo(nx * l.turn);
      });
    listen(hero, "pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      move(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    });
    listen(hero, "pointerleave", () => move(0, 0));
  }

  // a soft accent glow that follows the cursor across each project card (CSS reads --mx / --my)
  $$(".prow").forEach((card) => {
    listen(card, "pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
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
  heroExit();
  velocitySkew();
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
    gsap.set(
      "[data-scene], [data-scene] *, .hero-top, .hero-grid, .name b, .editor, .lead, .hero .cta, [data-magnetic]",
      { clearProps: "all" },
    );
    $$(".reel.pinned").forEach((reel) => reel.classList.remove("pinned"));
  };
}
