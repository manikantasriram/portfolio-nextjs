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

const SCRUB_SCENES = ["graph", "statement", "photos", "marquee"];
const INTENT_EVENTS = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"] as const;

/**
 * CSS reveals via IntersectionObserver for data-reveal / data-stagger / data-line / data-pop.
 * data-scene elements get GSAP scenes, loaded after the first interaction; until then they fall back
 * to the CSS reveal. Does nothing with reduced motion.
 */
export function Motion() {
  useEffect(() => {
    window.__motionReady = true;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      delete root.dataset.js; // CSS only hides elements while this is set
      return;
    }

    let scenes: Scenes | undefined;
    let disposeScenes: (() => void) | undefined;
    let requested = false;
    let stopped = false;
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
          // Starting ScrollTrigger mid-scroll cancels a smooth nav jump, so wait until scrolling stops.
          whenScrollSettles(() => {
            if (stopped) return;
            disposeScenes = loaded.start();
            scenes = loaded;
            waiting.forEach((el) => loaded.attach(el.dataset.scene as ScrubScene, el));
            waiting.clear();
          });
        })
        .catch(() => {
          delete root.dataset.js; // failed to load, just show everything
        });
    }
    INTENT_EVENTS.forEach((type) => window.addEventListener(type, requestScenes, { passive: true }));

    const reveal = (el: HTMLElement) => {
      const scene = el.dataset.scene;
      if (scene && SCRUB_SCENES.includes(scene)) {
        // scroll-linked, needs GSAP
        if (scenes) scenes.attach(scene as ScrubScene, el);
        else {
          waiting.add(el);
          requestScenes();
        }
      } else if (scene && scenes) {
        scenes.enter(scene as EnterScene, el);
      } else if (el.hasAttribute("data-stagger")) {
        el.querySelectorAll<HTMLElement>("[data-item]").forEach((item, i) => {
          item.style.transitionDelay = `${i * 55}ms`;
          item.classList.add("in");
          // remove the delay so it doesn't slow down hover transitions
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
    // reduced motion switched on mid-visit: stop and show everything
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
