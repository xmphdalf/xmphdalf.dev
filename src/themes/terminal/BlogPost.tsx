import Image from "next/image";
import Link from "next/link";

import { PostContent } from "@/components/site/PostContent";
import { isoDay, slugify } from "@/lib/format";
import { postPath, readingLabel } from "@/lib/posts";
import { asMedia } from "@/lib/profile";

import type { BlogPostProps } from "..";
import { chromeLinks, terminalSections } from "./sections";
import { SiteChrome } from "./SiteChrome";
import "./terminal.css";

/** One post in the terminal design: the post as an open file. */
export default function TerminalBlogPost({ profile, post, posts, newer, older }: BlogPostProps) {
  const resume = asMedia(profile.resume);
  const meta = [isoDay(post.publishedAt), readingLabel(post.readingMinutes)].filter(Boolean);

  return (
    <SiteChrome
      path={`${slugify(profile.name)}/blog/${post.slug}.md`}
      sections={terminalSections(profile, posts.length > 0)}
      posts={posts}
      blog={{ page: "post", slug: post.slug }}
      links={chromeLinks(profile, resume?.url)}
    >
      <main id="main" className="main">
        <article className="pane post" aria-labelledby="post-title">
          <p className="tab mono">{post.slug}.md</p>
          {meta.length || post.tags?.length ? (
            <p className="mono muted post-meta">
              {post.publishedAt ? <time dateTime={post.publishedAt}>{meta[0]}</time> : null}
              {meta.slice(post.publishedAt ? 1 : 0).map((item) => (
                <span key={item}>{item}</span>
              ))}
              {post.tags?.map((tag) => (
                <span key={tag} className="post-tag">
                  #{tag}
                </span>
              ))}
            </p>
          ) : null}
          <h1 id="post-title">{post.title}</h1>
          {post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
          {post.cover ? (
            <Image
              className="post-cover"
              src={post.cover.url}
              alt={post.cover.alt}
              width={post.cover.width ?? 1600}
              height={post.cover.height ?? 800}
              sizes="(max-width: 900px) 100vw, 760px"
              priority
            />
          ) : null}
          <PostContent content={post.content} />
          <p className="mono muted post-eof" aria-hidden="true">
            -- EOF --
          </p>
        </article>

        <nav className="pane post-nav mono" aria-label="More posts">
          {older ? (
            <Link className="post-nav-link" href={postPath(older.slug)} rel="prev">
              <span className="muted">← older</span>
              <b>{older.title}</b>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link className="post-nav-link next" href={postPath(newer.slug)} rel="next">
              <span className="muted">newer →</span>
              <b>{newer.title}</b>
            </Link>
          ) : null}
          <p className="post-nav-up">
            <span className="muted">$</span> <Link href="/blog">cd ..</Link>
          </p>
        </nav>

        <footer className="foot mono muted">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </SiteChrome>
  );
}
