"use client";

import { useEffect, useRef, useState } from "react";
import { runCommand, terminalHints, type TermLine } from "@/lib/terminal";

interface Entry {
  id: number;
  cmd: string;
  lines: TermLine[];
}

const MAX_ENTRIES = 24;

/**
 * The terminal under the hero editor. It shows the result of running main.py, then accepts
 * real commands: help, ls, git log, cd <section>, cat <file>, resume, theme...
 */
export function HeroTerminal({ sectionCount }: { sectionCount: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [cursor, setCursor] = useState(-1); // position in command history, -1 = new line
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const out = outRef.current;
    if (out) out.scrollTop = out.scrollHeight;
  }, [entries]);

  const submit = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const result = runCommand(cmd);
    setEntries((prev) =>
      result.clear
        ? []
        : [...prev, { id: nextId.current++, cmd, lines: result.lines }].slice(-MAX_ENTRIES),
    );
    setValue("");
    setCursor(-1);
    if (result.effect) setTimeout(result.effect, 120);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    const past = entries.map((x) => x.cmd);
    if (!past.length) return;
    e.preventDefault();
    const next =
      e.key === "ArrowUp"
        ? cursor === -1
          ? past.length - 1
          : Math.max(0, cursor - 1)
        : cursor === -1 || cursor >= past.length - 1
          ? -1
          : cursor + 1;
    setCursor(next);
    setValue(next === -1 ? "" : past[next]);
  };

  return (
    <div
      className="term"
      onClick={(e) => {
        // Clicking anywhere in the terminal focuses the prompt, unless text is being selected.
        if ((e.target as HTMLElement).closest("button")) return;
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div ref={outRef} className="term-out" role="log" aria-live="polite" aria-label="Terminal output">
        <span className="tl">
          <b>$</b> python main.py
        </span>
        <span className="tl ok">✓ rendered {sectionCount} sections</span>
        {entries.map((entry) => (
          <span key={entry.id} className="te">
            <span className="tc">
              <b>$</b> {entry.cmd}
            </span>
            {entry.lines.map((line, i) => (
              <span key={i} className={`to ${line.tone ?? ""}`}>
                {line.text}
              </span>
            ))}
          </span>
        ))}
      </div>
      <form
        className="term-in"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <b aria-hidden="true">$</b>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command. Type help for a list of commands."
          placeholder="type a command, e.g. help"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={60}
        />
      </form>
      <p className="term-hint">
        <span aria-hidden="true">try:</span>
        {terminalHints.map((hint) => (
          <button key={hint} type="button" onClick={() => submit(hint)} aria-label={`Run command: ${hint}`}>
            {hint}
          </button>
        ))}
      </p>
    </div>
  );
}
