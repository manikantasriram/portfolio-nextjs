/**
 * Below-the-fold sections start with content-visibility: auto and get rendered one per idle callback
 * after load. In-page jumps render everything first, then re-check the target for a few seconds in
 * case the smooth scroll gets interrupted.
 */

/** Renders every section now and switches the lazy mode off for good. */
export function renderAllSections() {
  delete document.documentElement.dataset.lazy;
}

/** Renders the skipped sections one by one while the browser is idle. Returns a cancel function. */
function renderSectionsWhenIdle() {
  const root = document.documentElement;
  if (!root.dataset.lazy) return () => {};

  const queue = Array.from(document.querySelectorAll<HTMLElement>(".sec, .footer"));
  const hasIdle = typeof window.requestIdleCallback === "function";
  let handle = 0;
  let cancelled = false;

  const schedule = () => {
    handle = hasIdle
      ? window.requestIdleCallback(step, { timeout: 1500 })
      : window.setTimeout(step, 150);
  };
  function step() {
    if (cancelled) return;
    const section = queue.shift();
    if (!section || !root.dataset.lazy) {
      renderAllSections();
      return;
    }
    section.classList.add("ready");
    schedule();
  }

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (hasIdle) window.cancelIdleCallback(handle);
    else window.clearTimeout(handle);
  };
}

// jump checking

const MAX_RETRIES = 2;
const TICK_MS = 100;
/** Not arrived and not moving for this long means the scroll was cut short. */
const STALLED_MS = 300;
const GIVE_UP_MS = 6000;

let jump: { id: string; retries: number } | null = null;
let watchdog = 0;

function stopWatching() {
  window.clearInterval(watchdog);
  jump = null;
}

function hasArrived(target: HTMLElement) {
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  return atBottom || Math.abs(target.getBoundingClientRect().top - offset) <= 4;
}

/**
 * Call right before scrolling to a section. Uses a timer instead of `scrollend` because a scroll
 * that's cancelled before it moves never fires that event.
 */
export function prepareJump(id: string) {
  renderAllSections();
  stopWatching();
  if (!id || id === "top") return;

  jump = { id, retries: 0 };
  let lastY = window.scrollY;
  let stalled = 0;
  let elapsed = 0;
  watchdog = window.setInterval(() => {
    const target = jump && document.getElementById(jump.id);
    elapsed += TICK_MS;
    if (!jump || !target || elapsed > GIVE_UP_MS || hasArrived(target)) {
      stopWatching();
      return;
    }
    stalled = window.scrollY === lastY ? stalled + TICK_MS : 0;
    lastY = window.scrollY;
    if (stalled < STALLED_MS) return;
    if (jump.retries >= MAX_RETRIES) {
      stopWatching();
      return;
    }
    jump.retries += 1;
    stalled = 0;
    target.scrollIntoView(); // respects scroll-behavior
  }, TICK_MS);
}

function onAnchorClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
  const id = link?.getAttribute("href")?.slice(1);
  if (id !== undefined && id !== null) prepareJump(id);
}

/** Starts idle rendering and jump checking. Returns a function that stops both. */
export function startLazySections() {
  const cancelIdle = renderSectionsWhenIdle();
  document.addEventListener("click", onAnchorClick, true);
  // user took over, stop checking
  window.addEventListener("wheel", stopWatching, { passive: true });
  window.addEventListener("touchmove", stopWatching, { passive: true });
  return () => {
    cancelIdle();
    stopWatching();
    document.removeEventListener("click", onAnchorClick, true);
    window.removeEventListener("wheel", stopWatching);
    window.removeEventListener("touchmove", stopWatching);
  };
}
