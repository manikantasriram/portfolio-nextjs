"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { photography } from "@/lib/content";

/*
 * Frames: a horizontal reel of photos.
 *  - phones, or before GSAP arrives: a native swipe strip that snaps frame by frame
 *  - wide screens with GSAP: the reel pins (centred, adding no space of its own) and scrolling
 *    down travels sideways through it (the "photos" scene in lib/motion-scenes.ts)
 *  - every frame keeps its true proportions: same height, natural width, nothing cropped
 *  - captions sit under each photo, never on top of it
 *  - frames "develop" from grey to colour as they arrive (CSS)
 *  - tag filters swap the set with a short cross-fade (no frame ever overlaps another)
 *  - a frame opens /photos/<slug> in a new tab: the original, full size, downloadable
 *  - the reel ends on a quiet card that points to Instagram
 *  - phones and tablets get a control bar (previous / "03 / 16" + progress / next), the frame in
 *    front stays bright while the rest step back, and a one-time nudge shows the strip can be swiped
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function PhotoSheet() {
  const { intro, photos, instagram } = photography;
  const [tag, setTag] = useState("all");
  const trackRef = useRef<HTMLUListElement>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1));
    return [["all", photos.length] as const, ...counts];
  }, [photos]);

  const shownCount = photos.filter((p) => tag === "all" || p.tag === tag).length;
  /** Index of the frame in front of the strip (phones and tablets); shownCount = the Instagram card. */
  const [active, setActive] = useState(0);

  /** Every stop along the strip: the visible frames, then the Instagram card. */
  const stops = useCallback(() => {
    const track = trackRef.current;
    return track ? [...track.querySelectorAll<HTMLElement>(".shot:not([data-hidden]), .reel-end")] : [];
  }, []);

  /** Works out which frame is in front from the strip's scroll position. */
  const measureActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const edge = track.getBoundingClientRect().left + (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);
    const list = stops();
    let best = 0;
    let nearest = Infinity;
    list.forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - edge);
      if (d < nearest) [nearest, best] = [d, i];
    });
    // The last frames of a long strip can't reach the left edge, so "scrolled to the end" means the
    // last stop. (A short set that fits without scrolling stays on its first frame.)
    const max = track.scrollWidth - track.clientWidth;
    if (max > 4 && track.scrollLeft >= max - 4) best = list.length - 1;
    setActive(best);
  }, [stops]);

  // Follow the scroll position, so swipes, buttons and keys always agree.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureActive);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [measureActive]);

  /** Moves the strip one frame forward or back. */
  const go = (step: number) => {
    const track = trackRef.current;
    const list = stops();
    const target = list[Math.max(0, Math.min(list.length - 1, active + step))];
    if (!track || !target) return;
    const edge = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const left = track.scrollLeft + target.getBoundingClientRect().left - track.getBoundingClientRect().left - edge;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  };

  // The first time the strip is seen on a phone or tablet, it slides a little and back:
  // a wordless hint that it can be swiped. Once per visit, never with reduced motion.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("IntersectionObserver" in window)) return;
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (track.scrollLeft > 4) return; // already swiping: no need to teach it
        timer = window.setTimeout(() => {
          track.classList.add("nudge");
          timer = window.setTimeout(() => track.classList.remove("nudge"), 1300);
        }, 450);
      },
      { threshold: 0.6 },
    );
    io.observe(track);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  /** True while a filter change is cross-fading the reel. */
  const swapping = useRef(false);

  /**
   * Changing the filter: the reel fades out, the set swaps, it starts again at frame 01 and fades
   * back in. Every frame (and the Instagram card) stays in normal layout the whole time, so
   * nothing can slide under or over anything else mid-change.
   */
  const pick = (next: string) => {
    if (next === tag) return;
    const track = trackRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(0);
    if (!track) return setTag(next);
    swapping.current = true;
    track.classList.add("swapping");
    window.setTimeout(() => setTag(next), reduce ? 0 : 200);
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!swapping.current || !track) return;
    swapping.current = false;
    track.querySelectorAll(".shot:not([data-hidden])").forEach((el) => el.classList.add("in"));
    if (track.closest(".reel.pinned")) {
      // pinned desktop reel: re-measure the pin and return to its start (lib/motion-scenes.ts)
      track.closest(".reel")?.dispatchEvent(new CustomEvent("reel:change"));
    } else {
      // swipe strip: snapping is paused for a moment, otherwise the browser would keep the
      // previously snapped item (say, the Instagram card) in view instead of frame 01
      track.style.scrollSnapType = "none";
      track.scrollLeft = 0;
    }
    requestAnimationFrame(() => {
      track.scrollLeft = track.closest(".reel.pinned") ? track.scrollLeft : 0;
      track.style.scrollSnapType = "";
      measureActive(); // no scroll event fires when already at 0, so re-check explicitly
      track.classList.remove("swapping");
    });
  }, [tag, measureActive]);

  let slot = 0;

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
            const at = on ? slot++ : -1;
            return (
              <li
                key={p.slug}
                className="shot"
                data-reveal=""
                data-hidden={on ? undefined : ""}
                data-active={at === active ? "" : undefined}
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

          <li className="reel-end" data-reveal="" data-active={active >= shownCount ? "" : undefined}>
            <a href={instagram.url} target="_blank" rel="noopener noreferrer me">
              <span className="end-k">more on Instagram</span>
              <span className="end-h">@{instagram.handle}</span>
              <ArrowUpRight className="end-go" size={22} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* phones and tablets: thumb-sized controls under the strip, with where-am-I progress */}
        <div className="reel-nav" role="group" aria-label="Browse photos">
          <button
            type="button"
            className="rn-btn"
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Previous photo"
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
          </button>
          <p className="rn-count" aria-hidden="true">
            <b>{pad(Math.min(active + 1, shownCount))}</b> / {pad(shownCount)}
            <i className="rn-bar">
              <i style={{ transform: `scaleX(${Math.min(active + 1, shownCount) / shownCount})` }} />
            </i>
          </p>
          <button
            type="button"
            className="rn-btn"
            onClick={() => go(1)}
            disabled={active >= shownCount}
            aria-label="Next photo"
          >
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
