"use client";

import { useSyncExternalStore } from "react";
import { sections } from "@/lib/site";

export interface ScrollState {
  /** id of the section currently in view, or "home" above the first one */
  section: string;
  /** 0..1 scroll progress through the page */
  progress: number;
}

/** One rAF-throttled scroll listener for the whole page. React only re-renders when the active section changes. */
let state: ScrollState = { section: "home", progress: 0 };
const listeners = new Set<(s: ScrollState) => void>();
let targets: HTMLElement[] = [];
let started = false;
let frame = 0;

function update() {
  frame = 0;
  let section = "home";
  const line = window.innerHeight * 0.4;
  for (const el of targets) {
    if (el.getBoundingClientRect().top < line) section = el.id;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  if (section === state.section && progress === state.progress) return;
  state = { section, progress };
  listeners.forEach((listener) => listener(state));
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function start() {
  if (started) return;
  started = true;
  targets = sections
    .map((s) => document.getElementById(s.id))
    .filter((el): el is HTMLElement => el !== null);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
}

/** Calls `listener` with the current state now and on every scroll frame. Returns an unsubscribe. */
export function subscribeScroll(listener: (s: ScrollState) => void) {
  listeners.add(listener);
  start();
  listener(state);
  return () => {
    listeners.delete(listener);
  };
}

function subscribeSection(onChange: () => void) {
  let last = state.section;
  const listener = (s: ScrollState) => {
    if (s.section === last) return;
    last = s.section;
    onChange();
  };
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

/** The id of the section in view. Re-renders only when it changes. */
export function useActiveSection() {
  return useSyncExternalStore(
    subscribeSection,
    () => state.section,
    () => "home",
  );
}
