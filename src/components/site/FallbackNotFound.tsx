import ApplyColorScheme from "@/components/site/ApplyColorScheme";

/**
 * A plain 404 for designs that don't ship their own. Styles itself, so it
 * doesn't depend on any design's CSS, and follows the visitor's light/dark
 * mode (data-color-scheme on <html>).
 */
const styles = `
.fallback-404{position:fixed;inset:0;overflow:auto;display:grid;place-items:center;padding:24px;
  background:#fafaf9;color:#1c1c1a;font:400 16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.fallback-404 div{max-width:32rem}
.fallback-404 p{margin:0;color:#5c5b57}
.fallback-404 h1{margin:4px 0 16px;font-size:clamp(28px,5vw,40px);line-height:1.2;font-weight:600;color:inherit}
.fallback-404 a{color:inherit;text-underline-offset:3px}
.fallback-404 a:focus-visible{outline:2px solid currentColor;outline-offset:3px}
:root[data-color-scheme="dark"] .fallback-404{background:#1c1c1a;color:#f2f1ed}
:root[data-color-scheme="dark"] .fallback-404 p{color:#b3b1aa}
`;

export default function FallbackNotFound({ siteName }: { siteName?: string | null }) {
  return (
    <main id="main" className="fallback-404">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <ApplyColorScheme />
      <div>
        <p>404{siteName ? ` · ${siteName}` : ""}</p>
        <h1>Page not found</h1>
        {/* A plain link so it works without JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Back to the home page</a>
      </div>
    </main>
  );
}
