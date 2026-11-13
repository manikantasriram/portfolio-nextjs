/**
 * Progressive rendering of the sections below the fold.
 *
 * On first paint, sections outside the viewport are skipped (`content-visibility: auto` in
 * globals.css, switched on by the `data-lazy` mark that layout.tsx sets before paint). That
 * keeps the first frame cheap. Right after the page has loaded, the sections are rendered for
 * real, one per idle moment, so the work never blocks input.
 *
 * Anything that needs exact positions (a click on an in-page link, the command palette, the
 * terminal's `cd`) calls renderAllSections() first, so jumps always land precisely.
 */

/** Renders every section now and switches the lazy mode off for good. */
export function renderAllSections() {
  delete document.documentElement.dataset.lazy;
}

/** Renders the skipped sections one by one while the browser is idle. Returns a cancel function. */
export function renderSectionsWhenIdle() {
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

/** Any click on an in-page link renders everything first, so the jump target is exact. */
function onAnchorClick(event: MouseEvent) {
  if ((event.target as Element | null)?.closest?.('a[href^="#"]')) renderAllSections();
}

/** Starts idle rendering and anchor handling. Returns a function that stops both. */
export function startLazySections() {
  const cancelIdle = renderSectionsWhenIdle();
  document.addEventListener("click", onAnchorClick, true);
  return () => {
    cancelIdle();
    document.removeEventListener("click", onAnchorClick, true);
  };
}
