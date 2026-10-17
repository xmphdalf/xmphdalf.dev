import Link from "next/link";

import ApplyColorScheme from "@/components/site/ApplyColorScheme";

import { fontVariables } from "./fonts";
import "./editorial.css";

/** The 404 page in the editorial design. Same wording as the terminal one. */
export default function EditorialNotFound() {
  return (
    <div className={`editorial ${fontVariables}`}>
      <ApplyColorScheme />
      <main id="main" className="page">
        <section className="cover not-found" aria-labelledby="not-found-title">
          <p className="kicker">404</p>
          <h1 id="not-found-title">Page not found</h1>
          <p className="standfirst">
            <Link className="il" href="/">
              Back to the home page
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
