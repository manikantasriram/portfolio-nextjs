"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { downloadResume, openExternal, scrollToSection, sendEmail } from "@/lib/actions";
import { experience } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { toggleTheme } from "@/lib/theme";
import { sections, site } from "@/lib/site";

interface PaletteContextValue {
  open: () => void;
}

const PaletteContext = createContext<PaletteContextValue>({ open: () => {} });

export const useCommandPalette = () => useContext(PaletteContext);

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

const externalLinks = experience.flatMap((role) => (role.link ? [role.link] : []));

const commands: Command[] = [
  ...sections.map((sec) => ({
    label: `Go to ${sec.label}`,
    hint: `~/${sec.file}`,
    run: () => scrollToSection(sec.id),
  })),
  { label: "Toggle light / dark theme", hint: "theme", run: () => toggleTheme() },
  { label: "Download resume", hint: "pdf", run: downloadResume },
  { label: "Send an email", hint: "mailto", run: sendEmail },
  { label: "Open GitHub", hint: "github.com", run: () => openExternal(site.github) },
  { label: "Open LinkedIn", hint: "linkedin.com", run: () => openExternal(site.linkedin) },
  ...externalLinks.map((link) => ({
    label: `Open ${link.label}`,
    hint: new URL(link.href).hostname.replace("www.", ""),
    run: () => openExternal(link.href),
  })),
];

/** Ctrl/Cmd+K (or "/") command palette, kept from the original site. */
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Return focus to whatever opened the palette.
    requestAnimationFrame(() => lastFocus.current?.focus?.());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
        return;
      }
      if (!isOpen && e.key === "/") {
        const tag = (document.activeElement as HTMLElement | null)?.tagName ?? "";
        if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      {isOpen && <Palette onClose={close} />}
    </PaletteContext.Provider>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Entrance: backdrop fades, the panel drops in, commands cascade.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        // opacity only: `visibility: hidden` would stop the input taking focus
        .fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" })
        .fromTo(".pal-b", { y: -14, scale: 0.97 }, { y: 0, scale: 1, duration: 0.45 }, 0)
        .fromTo(
          ".pal-l li",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.018, clearProps: "all" },
          0.05,
        );
    },
    { scope: rootRef },
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const run = (cmd: Command | undefined) => {
    if (!cmd) return;
    onClose();
    // Let the palette start closing (and focus return) before scrolling or navigating.
    setTimeout(cmd.run, 40);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" && visible.length) {
      e.preventDefault();
      setSelected((s) => (s + 1) % visible.length);
    } else if (e.key === "ArrowUp" && visible.length) {
      e.preventDefault();
      setSelected((s) => (s - 1 + visible.length) % visible.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(visible[selected]);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog; the input is its only focus stop.
      e.preventDefault();
    }
  };

  return (
    <div
      ref={rootRef}
      className="pal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div className="pal-b" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="pal-i">
          <span aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Type a command or search"
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-label="Search commands"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={visible.length ? `${listId}-${selected}` : undefined}
          />
        </div>
        <ul ref={listRef} id={listId} className="pal-l" role="listbox" aria-label="Commands">
          {visible.length ? (
            visible.map((cmd, i) => (
              <li
                key={cmd.label}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === selected}
                data-index={i}
                onMouseMove={() => setSelected(i)}
                onClick={() => run(cmd)}
              >
                <span>{cmd.label}</span>
                <small>{cmd.hint}</small>
              </li>
            ))
          ) : (
            <li className="none" role="presentation">
              No matching commands
            </li>
          )}
        </ul>
        <p className="pal-h">
          <kbd>↑</kbd> <kbd>↓</kbd> navigate &nbsp; <kbd>Enter</kbd> run &nbsp; <kbd>Esc</kbd> close
        </p>
      </div>
    </div>
  );
}
