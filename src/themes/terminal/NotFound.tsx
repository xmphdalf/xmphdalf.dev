import Link from "next/link";

import ApplyColorScheme from "@/components/site/ApplyColorScheme";

import "./terminal.css";

export default function TerminalNotFound() {
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
