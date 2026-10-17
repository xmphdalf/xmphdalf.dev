"use client";

import { useField } from "@payloadcms/ui";

import { DEFAULT_THEME, isThemeId, THEMES } from "../../themes/manifest";

/**
 * The Designs card list. Edits the hidden activeTheme and enabledThemes
 * fields; changes apply when the page is saved. The server re-checks every
 * rule (hooks/validateAppearance), so this only makes the rules visible.
 */
export function DesignsField() {
  const active = useField<string>({ path: "activeTheme" });
  const enabled = useField<string[]>({ path: "enabledThemes" });

  const activeId = active.value;
  const enabledIds = Array.isArray(enabled.value) ? enabled.value : [];
  // Saved ids can outlive a design that was removed from the code.
  const staleIds = [activeId, ...enabledIds].filter((id) => id && !isThemeId(id));
  const fallbackLabel = THEMES.find((theme) => theme.id === DEFAULT_THEME)?.label ?? DEFAULT_THEME;

  // Every change also drops ids that are no longer in the code.
  const setEnabled = (id: string, on: boolean) => {
    const next = on ? [...enabledIds, id] : enabledIds.filter((value) => value !== id);
    enabled.setValue(THEMES.map((theme) => theme.id).filter((value) => next.includes(value)));
  };

  const makeActive = (id: string) => {
    setEnabled(id, true);
    active.setValue(id);
  };

  const errors = [active, enabled].filter((field) => field.showError && field.errorMessage);

  return (
    <div className="designs-field">
      {errors.map((field) => (
        <p key={field.path} className="designs-field__error" role="alert">
          {field.errorMessage}
        </p>
      ))}
      {staleIds.length ? (
        <p className="designs-field__error" role="alert">
          Saved settings mention a design that is no longer in the code ({[...new Set(staleIds)].join(", ")}).
          {isThemeId(activeId) ? "" : ` The site is showing ${fallbackLabel} for now.`} Make a design active and save to fix this.
        </p>
      ) : null}
      <ul className="designs-field__list">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeId;
          const isEnabled = enabledIds.includes(theme.id);
          const status = isActive ? "Active" : isEnabled ? "On" : "Off";
          const toggleId = `design-enabled-${theme.id}`;

          return (
            <li key={theme.id} className={`designs-field__card${isActive ? " is-active" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static file, admin only */}
              <img className="designs-field__thumb" src={theme.thumbnail} alt="" width={320} height={200} />
              <div className="designs-field__body">
                <div className="designs-field__title">
                  <h3>{theme.label}</h3>
                  <span className={`designs-field__badge is-${status.toLowerCase()}`}>{status}</span>
                </div>
                <p className="designs-field__desc">{theme.description}</p>
                <label className="designs-field__toggle" htmlFor={toggleId}>
                  <input
                    id={toggleId}
                    type="checkbox"
                    checked={isEnabled}
                    disabled={isActive}
                    onChange={(event) => setEnabled(theme.id, event.target.checked)}
                  />
                  Turned on
                </label>
                {isActive ? (
                  <p className="designs-field__hint">The active design can’t be turned off. Make another design active first.</p>
                ) : null}
                <div className="designs-field__actions">
                  <a className="btn btn--style-secondary btn--size-small" href={`/preview?design=${theme.id}`} target="_blank" rel="noopener noreferrer">
                    Preview ↗
                  </a>
                  {!isActive ? (
                    <button type="button" className="btn btn--style-primary btn--size-small" onClick={() => makeActive(theme.id)}>
                      Make active
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="designs-field__note">
        Changes go live when you save. Preview opens one design in a new tab, using your saved content.
      </p>
    </div>
  );
}
