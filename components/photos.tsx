"use client";

import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { photography } from "@/lib/content";

/*
 * Off the clock: a horizontal reel of photos.
 *  - phones, or before GSAP arrives: a native swipe strip that snaps frame by frame
 *  - wide screens with GSAP: the reel pins (centred, adding no space of its own) and scrolling
 *    down travels sideways through it (the "photos" scene in lib/motion-scenes.ts)
 *  - every frame keeps its true proportions: same height, natural width, nothing cropped
 *  - captions sit under each photo, never on top of it
 *  - frames "develop" from grey to colour as they arrive (CSS)
 *  - tag filters re-flow the reel with GSAP Flip, loaded on demand
 *  - a frame opens /photos/<slug> in a new tab: the original, full size, downloadable
 *  - the reel ends on a quiet card that points to Instagram
 */

type FlipKit = {
  gsap: typeof import("gsap").gsap;
  Flip: typeof import("gsap/Flip").Flip;
};
let kit: FlipKit | null = null;
let kitLoading: Promise<FlipKit> | null = null;

/** GSAP + Flip, fetched the first time someone reaches for the filters. */
function loadFlip() {
  kitLoading ??= Promise.all([import("gsap"), import("gsap/Flip")]).then(([g, f]) => {
    g.gsap.registerPlugin(f.Flip);
    kit = { gsap: g.gsap, Flip: f.Flip };
    return kit;
  });
  return kitLoading;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function PhotoSheet() {
  const { intro, photos, instagram } = photography;
  const [tag, setTag] = useState("all");
  const trackRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<ReturnType<FlipKit["Flip"]["getState"]> | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1));
    return [["all", photos.length] as const, ...counts];
  }, [photos]);

  const shownCount = photos.filter((p) => tag === "all" || p.tag === tag).length;

  const pick = (next: string) => {
    if (next === tag) return;
    const track = trackRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (kit && track && !reduce) flipState.current = kit.Flip.getState(track.querySelectorAll(".shot"));
    setTag(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    const track = trackRef.current;
    if (!state || !kit || !track) return;
    flipState.current = null;
    const { gsap, Flip } = kit;
    const frames = track.querySelectorAll<HTMLElement>(".shot");
    track.classList.add("flipping");
    Flip.from(state, {
      targets: frames,
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, y: 30, duration: 0.3 }),
      onComplete: () => {
        track.querySelectorAll(".shot:not([data-hidden])").forEach((el) => el.classList.add("in"));
        gsap.set(frames, { clearProps: "opacity,transform" });
        track.classList.remove("flipping");
        // the reel changed length: let ScrollTrigger re-measure the pin
        window.dispatchEvent(new Event("resize"));
      },
    });
  }, [tag]);

  return (
    <>
      <p className="shots-intro" data-reveal="">
        {intro}
      </p>
      <div className="reel" data-scene="photos">
        <div className="reel-tools" data-reveal="">
          <div
            className="fl"
            role="group"
            aria-label="Filter photos by subject"
            onPointerEnter={loadFlip}
            onFocus={loadFlip}
            onTouchStart={loadFlip}
          >
            <span className="fl-cmd" aria-hidden="true">
              $ ls ~/photos --tag
            </span>
            {tags.map(([t, count]) => (
              <button
                key={t}
                type="button"
                className="fl-chip"
                aria-pressed={tag === t}
                onClick={() => pick(t)}
              >
                {t}
                <sup>{count}</sup>
              </button>
            ))}
          </div>
          <p className="reel-count" aria-hidden="true">
            <span className="reel-now">01</span> / {pad(shownCount)}
            <i className="reel-bar">
              <i />
            </i>
          </p>
        </div>
        <p className="sr-only" aria-live="polite">
          {tag === "all" ? "Showing all photos" : `Showing ${shownCount} ${tag} photos`}
        </p>

        <ul ref={trackRef} className="reel-track" aria-label="Photographs">
          {photos.map((p, i) => {
            const on = tag === "all" || p.tag === tag;
            return (
              <li
                key={p.slug}
                className="shot"
                data-reveal=""
                data-hidden={on ? undefined : ""}
                style={{ "--ar": `${p.full.width} / ${p.full.height}` } as React.CSSProperties}
              >
                <a
                  className="shot-link"
                  href={`/photos/${p.slug}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${p.title}: open the full photo in a new tab`}
                >
                  <figure>
                    <div className="frame">
                      {/* eslint-disable-next-line @next/next/no-img-element -- static export: originals served as-is */}
                      <img
                        src={`/images/photos/full/${p.slug}.jpg`}
                        width={p.full.width}
                        height={p.full.height}
                        alt={p.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="vf" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="open" aria-hidden="true">
                        full size <ArrowUpRight size={13} strokeWidth={2.2} />
                      </span>
                    </div>
                    <figcaption>
                      <span className="cap-n" aria-hidden="true">
                        {pad(i + 1)} · {p.tag}
                      </span>
                      <b>{p.title}</b>
                      <span className="cap-t">{p.caption}</span>
                    </figcaption>
                  </figure>
                </a>
              </li>
            );
          })}

          <li className="reel-end" data-reveal="">
            <a href={instagram.url} target="_blank" rel="noopener noreferrer me">
              <span className="end-k">more on Instagram</span>
              <span className="end-h">@{instagram.handle}</span>
              <ArrowUpRight className="end-go" size={22} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </li>
        </ul>
        <p className="shots-hint" aria-hidden="true">
          swipe →
        </p>
      </div>
    </>
  );
}
