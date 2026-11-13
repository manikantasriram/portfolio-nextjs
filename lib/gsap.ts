"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered once for the whole app; every animation imports GSAP from this file.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

/** Animations only run when the visitor has not asked for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** The site's signature easing, matching the CSS `--ease` curve. */
export const EASE_OUT = "expo.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
