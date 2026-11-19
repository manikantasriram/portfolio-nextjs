"use client";

import { useEffect } from "react";

/** Touch screens can't hover, so a tap on a skill logo focuses it, which shows its name. */
export function OrbTap() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const orb = (e.target as HTMLElement).closest<HTMLElement>(".orb");
      orb?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
