"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /** Set once the animation layer has started (read by the bootstrap script in layout.tsx). */
    __motionReady?: boolean;
  }
}

type Scenes = typeof import("@/lib/motion-scenes");
type EnterScene = Parameters<Scenes["enter"]>[0];
type ScrubScene = Parameters<Scenes["attach"]>[0];

const SCRUB_SCENES = ["graph", "statement", "photos"];
const INTENT_EVENTS = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"] as const;

/**
 * Starts the page's motion without making the first paint wait for an animation library.
 *
 *  - The hero entrance is pure CSS and needs nothing from here.
 *  - Elements marked `data-reveal`, `data-stagger` + `data-item`, `data-line` or `data-pop` are
 *    plain CSS transitions: an IntersectionObserver adds the `in` class when they scroll into view.
 *  - Elements marked `data-scene` get a richer GSAP animation. GSAP lives in its own chunk
 *    (lib/motion-scenes.ts) and is only downloaded once the visitor first interacts with the page.
 *    If a scene scrolls into view before GSAP has arrived, it falls back to the CSS reveal.
 *
 * With `prefers-reduced-motion: reduce` nothing here runs and nothing is hidden.
 */
export function Motion() {
  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      delete root.dataset.js; // CSS only holds elements back while this mark is present
      return;
    }

    let scenes: Scenes | undefined;
    let disposeScenes: (() => void) | undefined;
    let requested = false;
    let stopped = false;
    /** Scroll-linked scenes that came into view before GSAP was ready. */
    const waiting = new Set<HTMLElement>();

    /** Runs `run` once the page has not scrolled for a quarter of a second. */
    let settleTimer = 0;
    let onSettleScroll: (() => void) | undefined;
    const whenScrollSettles = (run: () => void) => {
      const done = () => {
        if (onSettleScroll) window.removeEventListener("scroll", onSettleScroll);
        run();
      };
      onSettleScroll = () => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(done, 250);
      };
      window.addEventListener("scroll", onSettleScroll, { passive: true });
      settleTimer = window.setTimeout(done, 250);
    };

    const stopListeningForIntent = () =>
      INTENT_EVENTS.forEach((type) => window.removeEventListener(type, requestScenes));

    function requestScenes() {
      if (requested) return;
      requested = true;
      stopListeningForIntent();
      import("@/lib/motion-scenes")
        .then((loaded) => {
          // Starting ScrollTrigger mid-scroll would cancel a smooth jump to a section (the first
          // click on a nav link is often what triggers this download), so wait for a quiet moment.
          whenScrollSettles(() => {
            if (stopped) return;
            disposeScenes = loaded.start();
            scenes = loaded;
            waiting.forEach((el) => loaded.attach(el.dataset.scene as ScrubScene, el));
            waiting.clear();
          });
        })
        .catch(() => {
          delete root.dataset.js; // could not load: show everything instead
        });
    }
    INTENT_EVENTS.forEach((type) => window.addEventListener(type, requestScenes, { passive: true }));

    const reveal = (el: HTMLElement) => {
      const scene = el.dataset.scene;
      if (scene && SCRUB_SCENES.includes(scene)) {
        // follows the scroll position, so it needs GSAP: attach now, or as soon as it arrives
        if (scenes) scenes.attach(scene as ScrubScene, el);
        else {
          waiting.add(el);
          requestScenes();
        }
      } else if (scene && scenes) {
        scenes.enter(scene as EnterScene, el);
      } else if (el.hasAttribute("data-stagger")) {
        // children cascade: each one starts a beat after the previous
        el.querySelectorAll<HTMLElement>("[data-item]").forEach((item, i) => {
          item.style.transitionDelay = `${i * 55}ms`;
          item.classList.add("in");
          // drop the delay afterwards so it doesn't slow down hover transitions
          setTimeout(() => (item.style.transitionDelay = ""), 1400 + i * 55);
        });
      } else {
        el.classList.add("in");
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll("[data-reveal], [data-stagger], [data-line], [data-pop], [data-scene]")
      .forEach((el) => io.observe(el));

    const stop = () => {
      stopped = true;
      window.clearTimeout(settleTimer);
      if (onSettleScroll) window.removeEventListener("scroll", onSettleScroll);
      stopListeningForIntent();
      io.disconnect();
      disposeScenes?.();
    };
    // If the visitor switches reduced motion on mid-visit, stop and show everything.
    const onReduceChange = () => {
      if (!reduce.matches) return;
      stop();
      delete root.dataset.js;
    };
    reduce.addEventListener("change", onReduceChange);

    return () => {
      reduce.removeEventListener("change", onReduceChange);
      stop();
    };
  }, []);

  return null;
}
