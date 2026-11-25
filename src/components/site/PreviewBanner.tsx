import { THEMES, type ThemeId } from "@/themes/manifest";

type Props = {
  theme: ThemeId;
  previewed: boolean;
  /** Set on a post page, where Draft Mode also shows the post's latest draft. */
  draftPost?: boolean;
};

/**
 * Shown whenever Draft Mode is on, so an admin can always get out of it.
 * Rendered outside the design so it looks the same in every one.
 */
export default function PreviewBanner({ theme, previewed, draftPost = false }: Props) {
  const label = THEMES.find((item) => item.id === theme)?.label ?? theme;
  const message = draftPost
    ? `Previewing the latest draft of this post in the ${label} design. Visitors see the published version.`
    : previewed
      ? `Previewing the ${label} design. Visitors don’t see this.`
      : `Preview mode is on, showing the live ${label} design.`;
  return (
    <form
      method="post"
      action="/preview/exit"
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 16,
        zIndex: 1000,
        transform: "translateX(-50%)",
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 8px 8px 16px",
        borderRadius: 999,
        background: "#111",
        color: "#fff",
        font: "500 14px/1.4 system-ui, sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,.3)",
      }}
    >
      <span>{message}</span>
      <button
        type="submit"
        style={{ border: 0, borderRadius: 999, padding: "6px 12px", background: "#fff", color: "#111", font: "inherit", cursor: "pointer" }}
      >
        Exit preview
      </button>
    </form>
  );
}
