/**
 * Two small jobs that keep in-page navigation exact.
 *
 * 1. Progressive rendering. On first paint, sections outside the viewport are skipped
 *    (`content-visibility: auto` in globals.css, switched on by the `data-lazy` mark that
 *    layout.tsx sets before paint). Right after the page has loaded they are rendered for real,
 *    one per idle moment, so the work never blocks input. Anything that needs exact positions
 *    (a click on an in-page link, the command palette, the terminal's `cd`) renders them all first.
 *
 * 2. Jump checking. A smooth scroll to a section can be cut short, for example when the animation
 *    library measures the page just as the scroll starts. Once scrolling stops, we check that the
 *    target really is where it should be and finish the jump if not. If the visitor takes over
 *    (wheel, touch, keyboard), the check is dropped so we never fight their scrolling.
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

/* ------------------------------------------------------------ jump checking */

const MAX_RETRIES = 2;
let jump: { id: string; retries: number } | null = null;

/** Call just before scrolling to a section. Makes positions exact and arms the arrival check. */
export function prepareJump(id: string) {
  renderAllSections();
  jump = id && id !== "top" ? { id, retries: 0 } : null;
}

function checkArrival() {
  if (!jump) return;
  const target = document.getElementById(jump.id);
  if (!target) {
    jump = null;
    return;
  }
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const arrived = atBottom || Math.abs(target.getBoundingClientRect().top - offset) <= 4;
  if (arrived || jump.retries >= MAX_RETRIES) {
    jump = null;
    return;
  }
  jump.retries += 1;
  target.scrollIntoView(); // smooth or instant, following the page's scroll-behavior
}

function onAnchorClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
  const id = link?.getAttribute("href")?.slice(1);
  if (id !== undefined && id !== null) prepareJump(id);
}

/** The visitor is scrolling by hand: stop checking, the page is theirs. */
function onUserScroll() {
  jump = null;
}

/** Starts idle rendering and jump checking. Returns a function that stops both. */
export function startLazySections() {
  const cancelIdle = renderSectionsWhenIdle();
  document.addEventListener("click", onAnchorClick, true);
  window.addEventListener("scrollend", checkArrival);
  window.addEventListener("wheel", onUserScroll, { passive: true });
  window.addEventListener("touchmove", onUserScroll, { passive: true });
  return () => {
    cancelIdle();
    document.removeEventListener("click", onAnchorClick, true);
    window.removeEventListener("scrollend", checkArrival);
    window.removeEventListener("wheel", onUserScroll);
    window.removeEventListener("touchmove", onUserScroll);
  };
}
