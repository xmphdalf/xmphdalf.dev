import Link from "next/link";

import ApplyColorScheme from "@/components/site/ApplyColorScheme";

// Uses the terminal design's styles until 404s follow the active design.
import "@/themes/terminal/terminal.css";

export default function NotFound() {
  return (
    <main id="main" className="main">
      <ApplyColorScheme />
      <section className="pane" aria-labelledby="not-found-title">
        <p className="tab mono">404</p>
        <h1 id="not-found-title">Page not found</h1>
        <p className="lede">
          <Link href="/">Back to the home page</Link>
        </p>
      </section>
    </main>
  );
}
