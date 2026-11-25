import type { ComponentType } from "react";

import type { PostDetail, PostSummary } from "@/lib/posts";
import type { Profile } from "@/payload-types";

import type { ThemeId } from "./manifest";
import BoldBlogIndex from "./bold/BlogIndex";
import BoldBlogPost from "./bold/BlogPost";
import BoldTheme from "./bold";
import BoldNotFound from "./bold/NotFound";
import EditorialBlogIndex from "./editorial/BlogIndex";
import EditorialBlogPost from "./editorial/BlogPost";
import EditorialTheme from "./editorial";
import EditorialNotFound from "./editorial/NotFound";
import TerminalBlogIndex from "./terminal/BlogIndex";
import TerminalBlogPost from "./terminal/BlogPost";
import TerminalTheme from "./terminal";
import TerminalNotFound from "./terminal/NotFound";

/** Published posts, newest first, without bodies. Empty when there are none. */
export type HomeProps = { profile: Profile; posts: PostSummary[] };

/** /blog. Only rendered when at least one post is published. */
export type BlogIndexProps = { profile: Profile; posts: PostSummary[] };

/**
 * /blog/<slug>. `posts` is every published post (for navigation); `newer`
 * and `older` are this post's neighbours by date, when it has them.
 */
export type BlogPostProps = {
  profile: Profile;
  post: PostDetail;
  posts: PostSummary[];
  newer: PostSummary | null;
  older: PostSummary | null;
};

export type ThemeComponents = {
  /** The home page. Shows a short list of recent posts when there are any. */
  Page: ComponentType<HomeProps>;
  /** The blog index. */
  BlogIndex: ComponentType<BlogIndexProps>;
  /** One blog post. Render the body with components/site/PostContent. */
  BlogPost: ComponentType<BlogPostProps>;
  /** The 404 page. Optional; a plain self-styled 404 is shown when missing. */
  NotFound?: ComponentType;
};

/**
 * One entry per design in the manifest; TypeScript fails the build if one is
 * missing, or if a design leaves out the blog. Each design's CSS only applies
 * under its own data-site-theme, so importing every design here is safe.
 */
export const THEME_COMPONENTS = {
  terminal: { Page: TerminalTheme, BlogIndex: TerminalBlogIndex, BlogPost: TerminalBlogPost, NotFound: TerminalNotFound },
  bold: { Page: BoldTheme, BlogIndex: BoldBlogIndex, BlogPost: BoldBlogPost, NotFound: BoldNotFound },
  editorial: {
    Page: EditorialTheme,
    BlogIndex: EditorialBlogIndex,
    BlogPost: EditorialBlogPost,
    NotFound: EditorialNotFound,
  },
} satisfies Record<ThemeId, ThemeComponents>;
