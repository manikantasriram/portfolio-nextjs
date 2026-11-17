"use client";

import { useEffect, useRef } from "react";

/** The large contact email, shrunk just enough to stay on one line at any width. */
export function FitEmail({ email }: { email: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      // While the section is off-screen it is not laid out yet; the observer calls back once it is.
      if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true })) return;
      el.style.fontSize = "";
      const size = parseFloat(getComputedStyle(el).fontSize);
      const overflow = el.scrollWidth - el.clientWidth;
      if (overflow > 1) {
        el.style.fontSize = `${Math.max(12,Math.floor(((size * el.clientWidth) / el.scrollWidth) * 2) / 2 - 0.5)}px`;
      }
    };

    let width = 0;
    const ro = new ResizeObserver(() => {
      if (parent.clientWidth !== width) {
        width = parent.clientWidth;
        fit();
      }
    });
    ro.observe(parent);
    document.fonts?.ready.then(() => requestAnimationFrame(fit));
    return () => ro.disconnect();
  }, []);

  return (
    <a ref={ref} className="big" href={`mailto:${email}`}>
      {email}
    </a>
  );
}
