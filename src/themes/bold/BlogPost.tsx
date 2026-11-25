import Image from "next/image";
import Link from "next/link";

import { PostContent } from "@/components/site/PostContent";
import { formatDay } from "@/lib/format";
import { postPath, readingLabel } from "@/lib/posts";

import type { BlogPostProps } from "..";
import { Bar, boldSections, hasContactLinks } from "./Bar";
import { fontVariables } from "./fonts";
import "./bold.css";

/** One post in the bold design: a poster-sized title, then the text on the grid. */
export default function BoldBlogPost({ profile, post, posts, newer, older }: BlogPostProps) {
  const sections = boldSections(profile, posts.length > 0, hasContactLinks(profile));

  return (
    <div className={`bold-root ${fontVariables}`}>
      <a className="skip mono" href="#main">
        Skip to content
      </a>
      <Bar profile={profile} sections={sections} onBlog />

      <main id="main">
        <article className="post" aria-labelledby="post-title">
          <header className="post-head grid">
            <div className="post-meta mono">
              <Link className="link" href="/blog">
                ← Writing
              </Link>
              {post.publishedAt ? (
                <time className="dim" dateTime={post.publishedAt}>
                  {formatDay(post.publishedAt)}
                </time>
              ) : null}
              {post.readingMinutes ? <span className="dim">{readingLabel(post.readingMinutes)}</span> : null}
            </div>
            <h1 id="post-title" className="post-h1">
              {post.title}
              <span className="dot">.</span>
            </h1>
            {post.excerpt ? <p className="post-standfirst">{post.excerpt}</p> : null}
            {post.tags?.length ? (
              <ul className="tags mono post-tags" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </header>

          {post.cover ? (
            <div className="post-cover-wrap">
              <Image
                className="post-cover"
                src={post.cover.url}
                alt={post.cover.alt}
                width={post.cover.width ?? 1600}
                height={post.cover.height ?? 800}
                sizes="100vw"
                priority
              />
            </div>
          ) : null}

          <div className="post-body grid">
            <PostContent content={post.content} />
          </div>
        </article>

        {older || newer ? (
          <nav className="post-nav grid" aria-label="More posts">
            {older ? (
              <Link className="post-nav-cell" href={postPath(older.slug)} rel="prev">
                <span className="mono dim">← Older</span>
                <b>{older.title}</b>
              </Link>
            ) : null}
            {newer ? (
              <Link className="post-nav-cell next" href={postPath(newer.slug)} rel="next">
                <span className="mono dim">Newer →</span>
                <b>{newer.title}</b>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>

      <footer className="foot mono dim">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <Link href="/blog">All writing →</Link>
      </footer>
    </div>
  );
}
