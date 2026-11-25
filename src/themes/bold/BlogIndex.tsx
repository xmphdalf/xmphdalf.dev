import Link from "next/link";

import { formatDay } from "@/lib/format";
import { FEED_PATH, postPath, postsByYear, readingLabel } from "@/lib/posts";

import type { BlogIndexProps } from "..";
import { Bar, boldSections, hasContactLinks, sectionNumber } from "./Bar";
import { fontVariables } from "./fonts";
import "./bold.css";

/** /blog in the bold design: a giant title, then each year as a numbered stage. */
export default function BoldBlogIndex({ profile, posts }: BlogIndexProps) {
  const sections = boldSections(profile, true, hasContactLinks(profile));

  return (
    <div className={`bold-root ${fontVariables}`}>
      <a className="skip mono" href="#main">
        Skip to content
      </a>
      <Bar profile={profile} sections={sections} onBlog />

      <main id="main">
        <header className="blog-head grid">
          <p className="num" aria-hidden="true">
            {sectionNumber(sections, "writing")}
          </p>
          <h1 className="blog-title">
            Writing<span className="dot">.</span>
          </h1>
          <p className="blog-note mono dim">
            {posts.length === 1 ? "1 post" : `${posts.length} posts`}, newest first ·{" "}
            <a className="link" href={FEED_PATH}>
              RSS
            </a>
          </p>
        </header>

        {postsByYear(posts).map(({ year, posts: group }) => (
          <section key={year ?? "undated"} className="year grid" aria-labelledby={`y${year ?? "undated"}`}>
            <h2 id={`y${year ?? "undated"}`} className="year-num">
              {year ?? "—"}
            </h2>
            <ol className="entries">
              {group.map((post) => {
                const meta = [formatDay(post.publishedAt), readingLabel(post.readingMinutes)].filter(Boolean).join(" · ");
                return (
                  <li key={post.id} className="entry">
                    <h3>
                      <Link href={postPath(post.slug)}>{post.title}</Link>
                    </h3>
                    {meta ? <p className="mono dim">{meta}</p> : null}
                    {post.excerpt ? <p className="entry-excerpt">{post.excerpt}</p> : null}
                    {post.tags?.length ? (
                      <ul className="tags mono" aria-label="Tags">
                        {post.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </main>

      <footer className="foot mono dim">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <Link href="/">← Home</Link>
      </footer>
    </div>
  );
}
