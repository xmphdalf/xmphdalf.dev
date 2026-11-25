import Link from "next/link";

import { isoDay, slugify } from "@/lib/format";
import { FEED_PATH, postPath, postsByYear, readingLabel } from "@/lib/posts";
import { asMedia } from "@/lib/profile";

import type { BlogIndexProps } from "..";
import { chromeLinks, terminalSections } from "./sections";
import { SiteChrome } from "./SiteChrome";
import "./terminal.css";

/** /blog in the terminal design: `ls -lt`, one pane per year. */
export default function TerminalBlogIndex({ profile, posts }: BlogIndexProps) {
  const resume = asMedia(profile.resume);
  const years = postsByYear(posts);

  return (
    <SiteChrome
      path={`${slugify(profile.name)}/blog`}
      sections={terminalSections(profile, true)}
      posts={posts}
      blog={{ page: "index" }}
      links={chromeLinks(profile, resume?.url)}
    >
      <main id="main" className="main">
        <section className="pane hero blog-hero" aria-labelledby="blog-title">
          <p className="tab mono">blog/</p>
          <p className="mono muted">
            <span aria-hidden="true">$ </span>ls -lt ~/blog
          </p>
          <h1 id="blog-title">Blog</h1>
          <p className="facts mono">
            <span>
              {posts.length} {posts.length === 1 ? "post" : "posts"} · newest first
            </span>
            <a className="ext" href={FEED_PATH}>
              feed.xml
            </a>
          </p>
        </section>

        {years.map(({ year, posts: group }) => {
          const id = `y${year ?? "undated"}`;
          return (
            <section key={id} id={id} className="pane year" aria-labelledby={`${id}-title`}>
              <p className="tab mono">{year ?? "undated"}/</p>
              <h2 id={`${id}-title`} className="sr-only">
                {year ?? "Undated"}
              </h2>
              <ul className="log posts">
                {group.map((post) => (
                  <li key={post.id}>
                    <time className="mono when" dateTime={post.publishedAt ?? undefined}>
                      {isoDay(post.publishedAt)}
                    </time>
                    <div>
                      <h3>
                        <Link className="co" href={postPath(post.slug)}>
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt ? <p className="summary">{post.excerpt}</p> : null}
                      {post.tags?.length ? <p className="tags mono">{post.tags.map((tag) => `#${tag}`).join(" ")}</p> : null}
                    </div>
                    <span className="mono mins">{readingLabel(post.readingMinutes, "min")}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <footer className="foot mono muted">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </SiteChrome>
  );
}
