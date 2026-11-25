import Image from "next/image";
import Link from "next/link";

import { PostContent } from "@/components/site/PostContent";
import { formatDay } from "@/lib/format";
import { postPath, readingLabel } from "@/lib/posts";

import type { BlogPostProps } from "..";
import { fontVariables } from "./fonts";
import { Masthead } from "./Masthead";
import { blogMasthead } from "./sections";
import "./editorial.css";

/** One post in the editorial design: a magazine feature with a drop cap and an end mark. */
export default function EditorialBlogPost({ profile, post, newer, older }: BlogPostProps) {
  const kicker = [formatDay(post.publishedAt), readingLabel(post.readingMinutes)].filter(Boolean);

  return (
    <div className={`editorial ${fontVariables}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Masthead name={profile.name} homeHref="/" sections={blogMasthead(profile, false)} email={profile.email} />

      <main id="main" className="page">
        <article id="top" className="story" aria-labelledby="post-title">
          <header className="story-head">
            <p className="kicker">
              <Link className="u" href="/blog">
                Writing
              </Link>
              {kicker.map((item) => (
                <span key={item}>
                  <span aria-hidden="true"> · </span>
                  {item}
                </span>
              ))}
            </p>
            <h1 id="post-title">{post.title}</h1>
            {post.excerpt ? <p className="story-dek">{post.excerpt}</p> : null}
            <p className="byline">By {profile.name}</p>
          </header>

          {post.cover ? (
            <figure className="story-cover">
              <Image
                src={post.cover.url}
                alt={post.cover.alt}
                width={post.cover.width ?? 1600}
                height={post.cover.height ?? 800}
                sizes="(max-width: 1180px) 100vw, 1080px"
                priority
              />
            </figure>
          ) : null}

          <PostContent content={post.content} />

          {post.tags?.length ? (
            <p className="filed">
              <span className="label">Filed under</span> {post.tags.join(", ")}
            </p>
          ) : null}
        </article>

        {older || newer ? (
          <nav className="story-nav" aria-label="More writing">
            {older ? (
              <Link className="story-nav-link" href={postPath(older.slug)} rel="prev">
                <span className="label">Previous</span>
                <span className="story-nav-title">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link className="story-nav-link next" href={postPath(newer.slug)} rel="next">
                <span className="label">Next</span>
                <span className="story-nav-title">{newer.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <p className="story-all">
          <Link className="u" href="/blog">
            <span aria-hidden="true">← </span>All writing
          </Link>
        </p>
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
