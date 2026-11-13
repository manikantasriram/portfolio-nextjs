"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { navLinks } from "@/lib/site";
import { useScrollState } from "@/lib/use-active-section";

const subscribeNothing = () => () => {};
const isMacPlatform = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

export function Nav() {
  const [open, setOpen] = useState(false);
  const { section, progress } = useScrollState();
  const { open: openPalette } = useCommandPalette();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLLIElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const isMac = useSyncExternalStore(subscribeNothing, isMacPlatform, () => false);

  // Reading progress: a thin accent line along the bottom of the nav, driven by ScrollTrigger.
  useGSAP(
    () => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        },
      );
    },
    { scope: navRef },
  );

  // The highlight behind the active link glides between links as you scroll.
  useGSAP(
    () => {
      const list = listRef.current;
      const pill = pillRef.current;
      if (!list || !pill) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const place = (animate: boolean) => {
        const link = list.querySelector<HTMLElement>('a[aria-current="true"]');
        if (!link) {
          gsap.to(pill, { autoAlpha: 0, duration: 0.2, overwrite: true });
          return;
        }
        const box = {
          x: link.offsetLeft,
          y: link.offsetTop,
          width: link.offsetWidth,
          height: link.offsetHeight,
        };
        const hidden = gsap.getProperty(pill, "opacity") === 0;
        if (!animate || reduce || hidden) {
          gsap.set(pill, box);
          gsap.to(pill, { autoAlpha: 1, duration: 0.25, overwrite: "auto" });
        } else {
          gsap.to(pill, { ...box, autoAlpha: 1, duration: 0.55, ease: "expo.out", overwrite: true });
        }
      };

      place(true);
      const ro = new ResizeObserver(() => place(false));
      ro.observe(list);
      return () => ro.disconnect();
    },
    { dependencies: [section], scope: navRef },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 861px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onDesktop);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  // Mobile menu: links cascade in when it opens.
  useGSAP(
    () => {
      if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "#menu a",
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out", clearProps: "all" },
      );
    },
    { dependencies: [open], scope: navRef },
  );

  // Keep ScrollTrigger measurements right once web fonts have settled.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <nav ref={navRef} className="nav" aria-label="Primary" data-stuck={progress > 0}>
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <a href="#top" className="logo" aria-label="Manikanta Sriram, back to top">
          <i aria-hidden="true">&lt;</i>Manikanta Sriram<i aria-hidden="true"> /&gt;</i>
        </a>
        <div className="flex items-center gap-2">
          <ul ref={listRef} id="menu" className="links" data-open={open}>
            <li ref={pillRef} className="pill" role="presentation" aria-hidden="true" />
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={section === l.id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="kbtn" onClick={openPalette} aria-haspopup="dialog">
            <Search size={14} strokeWidth={2} aria-hidden="true" />
            <span>Search</span>
            <kbd aria-label={isMac ? "Command K" : "Control K"}>{isMac ? "⌘ K" : "Ctrl K"}</kbd>
          </button>
          <ThemeToggle />
          <button
            ref={burgerRef}
            type="button"
            className="ib burger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
      <span ref={barRef} className="progress" aria-hidden="true" />
    </nav>
  );
}
