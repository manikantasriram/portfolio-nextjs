"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { startLazySections } from "@/lib/lazy-sections";
import { subscribeScroll, useActiveSection } from "@/lib/scroll-store";
import { navLinks } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const section = useActiveSection();
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLLIElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // progress bar and border are updated in the DOM directly to avoid re-renders while scrolling
  useEffect(
    () =>
      subscribeScroll(({ progress }) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
        if (navRef.current) navRef.current.dataset.stuck = String(progress > 0);
      }),
    [],
  );

  useEffect(() => startLazySections(), []);

  // position the active-link highlight; CSS handles the transition
  useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const place = () => {
      const link = list.querySelector<HTMLElement>('a[aria-current="true"]');
      if (!link) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.opacity = "1";
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [section]);

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

  return (
    <nav ref={navRef} className="nav" aria-label="Primary">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <a href="#top" className="logo" aria-label="Manikanta Sriram, back to top">
          <i aria-hidden="true">&lt;</i>Manikanta Sriram<i aria-hidden="true"> /&gt;</i>
        </a>
        <div className="flex items-center gap-2">
          <ul ref={listRef} id="menu" className="links" data-open={open}>
            <li ref={pillRef} className="pill" role="presentation" aria-hidden="true" />
            {navLinks.map((l, i) => (
              <li key={l.id} style={{ "--n": i } as React.CSSProperties}>
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
