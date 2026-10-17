"use client";

import { useEffect, useId, useRef, useState } from "react";

export type Command = { label: string; hint: string; run: () => void };

type Props = {
  open: boolean;
  onClose: () => void;
  commands: Command[];
};

export function CommandPalette({ open, onClose, commands }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const listId = useId();

  const shown = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const current = Math.min(selected, Math.max(0, shown.length - 1));

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      input.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const run = (index: number) => {
    const command = shown[index];
    if (!command) return;
    onClose();
    command.run();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const count = shown.length || 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((current + 1) % count);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((current - 1 + count) % count);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(current);
    }
  };

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Command palette"
      onClose={() => {
        // Reset here rather than on open so keys typed straight after
        // Cmd-K are never cleared.
        setQuery("");
        setSelected(0);
        onClose();
      }}
      onClick={(event) => event.target === dialog.current && onClose()}
    >
      <input
        ref={input}
        className="pal-input"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        aria-activedescendant={shown.length ? `${listId}-${current}` : undefined}
        aria-label="Type a section or action"
        placeholder="Type a section or action…"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelected(0);
        }}
        onKeyDown={onKeyDown}
      />
      <ul id={listId} className="pal-list" role="listbox" aria-label="Commands">
        {shown.length ? (
          shown.map((command, index) => (
            <li
              key={command.label}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === current}
              onClick={() => run(index)}
              onMouseMove={() => index !== current && setSelected(index)}
            >
              <b>{command.label}</b>
              <span>{command.hint}</span>
            </li>
          ))
        ) : (
          <li className="empty">
            <b>No matches</b>
          </li>
        )}
      </ul>
      <p className="pal-hint mono muted">↑↓ navigate · ↵ open · esc close</p>
    </dialog>
  );
}
