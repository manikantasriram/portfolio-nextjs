"use client";

import { useEffect } from "react";

/**
 * Logo labels (Skills and project stacks).
 * - Touch screens can't hover, so a tap marks that logo (data-on) to show its name; tapping
 *   anywhere else clears it. Mouse clicks don't leave a label stuck, because the CSS shows names
 *   on :hover, :focus-visible (keyboard) and [data-on] only.
 * - A long name on an edge logo is nudged sideways (--dx) to stay inside its card or row; the
 *   label's arrow stays on the logo.
 */
export function OrbTap() {
  useEffect(() => {
    const fit = (orb: Element) => {
      const name = orb.querySelector<HTMLElement>(".orb-name");
      const box = orb.closest(".pbody, .sg");
      if (!name || !box || !(orb instanceof HTMLElement)) return;
      // from the logo's centre and the label's width (offsetWidth ignores the slide-in transform)
      const o = orb.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const left = o.left + o.width / 2 - name.offsetWidth / 2;
      const right = left + name.offsetWidth;
      const dx = Math.max(b.left - left, 0) + Math.min(b.right - right, 0);
      orb.style.setProperty("--dx", `${Math.round(dx)}px`);
    };
    const orbOf = (t: EventTarget | null) => (t instanceof Element ? t.closest(".orb") : null);

    const onDown = (e: PointerEvent) => {
      const orb = orbOf(e.target);
      if (orb) fit(orb);
      if (e.pointerType === "mouse") return;
      document.querySelectorAll(".orb[data-on]").forEach((el) => {
        if (el !== orb) el.removeAttribute("data-on");
      });
      orb?.setAttribute("data-on", "");
    };
    const onOver = (e: PointerEvent) => {
      const orb = orbOf(e.target);
      if (orb && e.pointerType === "mouse") fit(orb);
    };
    const onFocus = (e: FocusEvent) => {
      const orb = orbOf(e.target);
      if (orb) fit(orb);
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return null;
}
