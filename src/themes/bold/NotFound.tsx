import Link from "next/link";

import ApplyColorScheme from "@/components/site/ApplyColorScheme";

import { fontVariables } from "./fonts";
import "./bold.css";

export default function BoldNotFound() {
  return (
    <div className={`bold-root ${fontVariables}`}>
      <ApplyColorScheme />
      <main id="main" className="not-found grid" aria-labelledby="not-found-title">
        <p className="num" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title" className="contact-title">
          Page not found<span className="dot">.</span>
        </h1>
        <Link className="btn nf-home" href="/">
          Back to the home page →
        </Link>
      </main>
    </div>
  );
}
