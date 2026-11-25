import Link from "next/link";

import { formatDay } from "@/lib/format";
import { FEED_PATH, postPath, postsByYear, readingLabel } from "@/lib/posts";

import type { BlogIndexProps } from "..";
import { fontVariables } from "./fonts";
import { Masthead } from "./Masthead";
import { blogMasthead } from "./sections";
import "./editorial.css";

/** /blog in the editorial design: a cover, then a contents page by year. */
export default function EditorialBlogIndex({ profile, posts }: BlogIndexProps) {
  return (
    <div className={`editorial ${fontVariables}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Masthead name={profile.name} homeHref="/" sections={blogMasthead(profile, true)} email={profile.email} />

      <main id="main" className="page">
        <section id="top" className="cover blog-cover" aria-labelledby="top-title">
          <p className="kicker">{profile.name}</p>
          <h1 id="top-title">
            <em>Writing</em>
          </h1>
          <div className="cover-foot">
            <p className="standfirst">
              {posts.length === 1 ? "One piece" : `${posts.length} pieces`}, newest first.
            </p>
            <p className="blog-feed">
              <a className="u quiet" href={FEED_PATH}>
                Follow by RSS<span aria-hidden="true"> ↗</span>
              </a>
            </p>
          </div>
        </section>

        {postsByYear(posts).map(({ year, posts: group }) => {
          const id = `y${year ?? "undated"}`;
          return (
            <section key={id} className="block year" aria-labelledby={`${id}-title`}>
              <header className="block-head">
                <span className="no" aria-hidden="true">
                  §
                </span>
                <h2 id={`${id}-title`}>{year ?? "Undated"}</h2>
              </header>
              <ol className="entries">
                {group.map((post) => (
                  <li key={post.id}>
                    <p className="when">{formatDay(post.publishedAt)}</p>
                    <div>
                      <h3>
                        <Link className="story-link" href={postPath(post.slug)}>
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt ? <p className="summary">{post.excerpt}</p> : null}
                      {post.readingMinutes || post.tags?.length ? (
                        <p className="tech">
                          {[readingLabel(post.readingMinutes), post.tags?.join(", ")].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </main>

      <footer className="colophon">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a className="u" href="#top">
          Back to top<span aria-hidden="true"> ↑</span>
        </a>
      </footer>
    </div>
  );
}
